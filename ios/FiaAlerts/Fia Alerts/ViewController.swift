//
//  ViewController.swift
//  Fia Alerts
//
//  Created by Jukka Miettinen on 27/11/2017.
//  Copyright © 2017 Nitor. All rights reserved.
//

import UIKit
import CoreLocation
import AWSS3
import Alamofire

private let arrayParametersKey = "arrayParametersKey"

/// Extenstion that allows an array be sent as a request parameters
extension Array {
    /// Convert the receiver array to a `Parameters` object.
    func asParameters() -> Parameters {
        return [arrayParametersKey: self]
    }
}


/// Convert the parameters into a json array, and it is added as the request body.
/// The array must be sent as parameters using its `asParameters` method.
public struct ArrayEncoding: ParameterEncoding {

    /// The options for writing the parameters as JSON data.
    public let options: JSONSerialization.WritingOptions


    /// Creates a new instance of the encoding using the given options
    ///
    /// - parameter options: The options used to encode the json. Default is `[]`
    ///
    /// - returns: The new instance
    public init(options: JSONSerialization.WritingOptions = []) {
        self.options = options
    }

    public func encode(_ urlRequest: URLRequestConvertible, with parameters: Parameters?) throws -> URLRequest {
        var urlRequest = try urlRequest.asURLRequest()

        guard let parameters = parameters,
            let array = parameters[arrayParametersKey] else {
                return urlRequest
        }

        do {
            let data = try JSONSerialization.data(withJSONObject: array, options: options)

            if urlRequest.value(forHTTPHeaderField: "Content-Type") == nil {
                urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
            }

            urlRequest.httpBody = data

        } catch {
            throw AFError.parameterEncodingFailed(reason: .jsonEncodingFailed(error: error))
        }

        return urlRequest
    }
}

class ViewController: UIViewController, CLLocationManagerDelegate {

    let bucket = "rptf-fia-alerts"
    var locationManager: CLLocationManager = CLLocationManager()
    var startLocation: CLLocation!
    var latitude = 36.114647
    var longitude = -115.172813

    override func viewDidLoad() {
        super.viewDidLoad()

        let credentialsProvider = AWSCognitoCredentialsProvider(regionType: .USEast1,
                                                                identityPoolId: "eu-west-1:ec5ab305-9612-4cc8-aa2f-5feb87afbf28")
        let configuration = AWSServiceConfiguration(region:.USEast1, credentialsProvider:credentialsProvider)
        AWSServiceManager.default().defaultServiceConfiguration = configuration

        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.delegate = self
        locationManager.requestWhenInUseAuthorization()
        locationManager.startUpdatingLocation()
        startLocation = nil

//        let fileUrl = Bundle.main.path(forResource: "profile", ofType: "png")
//        let fileUrlPath = URL.init(fileURLWithPath: fileUrl!)
//        let data = try? Data(contentsOf: fileUrlPath)
//        let image: UIImage = UIImage(data: data!)!
//        self.uploadImage(with: "profile", type: "png", image: image)

//        let parameters: [String: Any] =
//        [
//            "type": "security",
//            "lon": 25.6,
//            "lat": 60.0,
//            "description": "this is sparta",
//            "time": "2017-11-26T10:34:56.123Z"
//        ]


    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        let latestLocation: CLLocation = locations[locations.count - 1]

        self.latitude = latestLocation.coordinate.latitude
        self.longitude = latestLocation.coordinate.longitude

        print(latitude)
        print(longitude)

        uploadAlert(type: "security", latitude: String(format: "%f", latitude), longitude: String(format: "%f", longitude), description: "This is SPARTA!")
    }

    func uploadImage(with resource: String, type: String, image: UIImage) {
        let key = "\(resource).\(type)"
        let imageData = UIImageJPEGRepresentation(image, 1)!

        let transferUtility = AWSS3TransferUtility.default()
        transferUtility.uploadData(imageData, bucket: bucket, key: key, contentType: "image/\(type)", expression: nil, completionHandler: nil).continueWith { (task) -> AnyObject!
            in
            if let error = task.error {
                print("Error: \(error.localizedDescription)")
            }

            if let _ = task.result {
                print("Uploaded \(key)")
            }
            return nil
        }
    }

    func uploadAlert(type: String, latitude: String, longitude: String, description: String) {
        let date = Date()
        let formatter = DateFormatter()
        formatter.dateFormat = "dd.MM.yyyy HH:mm:ss"
        let time = formatter.string(from: date)
        let parameters = ["type": type, "lon": longitude, "lat": latitude, "description": description, "time": time] as [String : Any]

        //create the url with NSURL
        let url = NSURL(string: "https://by82o3xxec.execute-api.us-east-1.amazonaws.com/riki/alert/create")

        //create the session object
        let session = URLSession.shared

        //now create the NSMutableRequest object using the url object
        let request = NSMutableURLRequest(url: url! as URL)
        request.httpMethod = "POST" //set http method as POST

        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: parameters, options: .prettyPrinted) // pass dictionary to nsdata object and set it as request body

        } catch let error {
            print(error.localizedDescription)
        }

        //HTTP Headers
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("application/json", forHTTPHeaderField: "Accept")

        //create dataTask using the session object to send data to the server
        let task = session.dataTask(with: request as URLRequest, completionHandler: { data, response, error in

            guard error == nil else {
                return
            }

            guard let data = data else {
                return
            }

            do {
                //create json object from data
                if let json = try JSONSerialization.jsonObject(with: data, options: .mutableContainers) as? [String: AnyObject] {
                    print(json)
                    // handle json...
                }

            } catch let error {
                print(error.localizedDescription)
            }

        })

        task.resume()
    }
}

