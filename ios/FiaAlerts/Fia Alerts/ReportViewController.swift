//
//  ReportViewController.swift
//  Fia Alerts
//
//  Created by Jukka Miettinen on 28/11/2017.
//  Copyright © 2017 Nitor. All rights reserved.
//

import UIKit
import SnapKit
import CoreLocation
import AWSS3
import Alamofire

class ReportViewController: UIViewController, CLLocationManagerDelegate, UITextViewDelegate, UIImagePickerControllerDelegate, UINavigationControllerDelegate {

    let button = UIButton()
    let imageView = UIImageView()
    let imagePicker = UIImagePickerController()
    let textView = UITextView()
    var reportDescription: String = "No description was provided"
    let bucket = "rptf-fia-alerts"
    var locationManager: CLLocationManager = CLLocationManager()
    var startLocation: CLLocation!
    var latitude = 36.119499522
    var longitude = -115.167999328
    var label: String = ""
    @IBOutlet weak var descriptionLabel: UILabel!

    override func viewDidLoad() {
        super.viewDidLoad()
        self.title = label

        imagePicker.delegate = self

        textView.delegate = self
        textView.becomeFirstResponder()

        let credentialsProvider = AWSCognitoCredentialsProvider(regionType: .USEast1,
                                                                identityPoolId: "eu-west-1:ec5ab305-9612-4cc8-aa2f-5feb87afbf28")
        let configuration = AWSServiceConfiguration(region:.USEast1, credentialsProvider:credentialsProvider)
        AWSServiceManager.default().defaultServiceConfiguration = configuration

        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.delegate = self
        locationManager.requestWhenInUseAuthorization()
        locationManager.startUpdatingLocation()
        startLocation = nil

        createUi()
    }

    func createUi() {
        let description = UILabel()
        description.font = UIFont.systemFont(ofSize: 14)
        description.text = "Describe the emergency"
        self.view.addSubview(description)
        description.snp.makeConstraints { (make) in
            make.width.equalTo(self.view)
            make.height.equalTo(30)
            make.centerX.equalTo(self.view)
            make.top.equalTo(self.view).offset(80)
            make.leftMargin.rightMargin.equalTo(10)
        }

        textView.text = "Type here"
        textView.textColor = UIColor.gray
        textView.layer.borderColor = UIColor.gray.cgColor
        textView.layer.cornerRadius = 5
        textView.layer.borderWidth = 1
        textView.textContainerInset = UIEdgeInsetsMake(7, 7, 5, 5)
        self.view.addSubview(textView)
        textView.snp.makeConstraints { (make) in
            make.width.equalTo(self.view).offset(-40)
            make.height.equalTo(100)
            make.centerX.equalTo(self.view)
            make.top.equalTo(description.snp.bottom).offset(0)
        }

        let attachImage = UILabel()
        attachImage.font = UIFont.systemFont(ofSize: 14)
        attachImage.text = "Attach image"
        self.view.addSubview(attachImage)
        attachImage.snp.makeConstraints { (make) in
            make.width.equalTo(self.view)
            make.height.equalTo(30)
            make.centerX.equalTo(self.view)
            make.top.equalTo(textView.snp.bottom).offset(20)
            make.leftMargin.rightMargin.equalTo(10)
        }

        let galleryImage = UIImage(named: "camera.png")!.withRenderingMode(.alwaysTemplate)
        let gallery = UIImageView(image: galleryImage)
        gallery.isUserInteractionEnabled = true
        self.view.addSubview(gallery)
        let galleryTapped = UITapGestureRecognizer(target: self, action: #selector(handleGalleryTap))
        gallery.addGestureRecognizer(galleryTapped)
        gallery.tintColor = UIColor.black
        gallery.snp.makeConstraints { (make) in
            make.left.equalTo(attachImage).offset(0)
            make.top.equalTo(attachImage.snp.bottom).offset(10)
            make.width.height.equalTo(30)
        }

        self.view.addSubview(imageView)
        imageView.contentMode = .scaleAspectFill
        imageView.snp.makeConstraints { (make) in
            make.top.equalTo(gallery.snp.bottom).offset(70)
            make.left.equalTo(gallery)
            make.width.equalTo(self.view).offset(-45)
            make.height.equalTo(200)
            make.centerX.equalTo(self.view)
        }

        button.setTitle("Send report", for: .normal)
        button.setTitleColor(UIColor.black, for: .normal)
        self.view.addSubview(button)
        let reportTapped = UITapGestureRecognizer(target: self, action: #selector(handleReportTap))
        button.addGestureRecognizer(reportTapped)
        button.snp.makeConstraints { (make) in
            make.width.equalTo(100)
            make.height.equalTo(50)
            make.bottom.equalTo(self.view.snp.bottom).offset(-20)
            make.centerX.equalTo(self.view.snp.centerX)
        }

        let viewTapped = UITapGestureRecognizer(target: self, action: #selector(handleViewTap))
        self.view.addGestureRecognizer(viewTapped)
    }

    func textViewDidChange(_ textView: UITextView) {
        //
    }

    func textViewDidBeginEditing(_ textView: UITextView) {
        if (textView.text.contains("Type here")) {
            textView.text = ""
        }
    }

    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
        let image = info[UIImagePickerControllerOriginalImage] as! UIImage
        self.dismiss(animated: false, completion: { () -> Void in
            self.imageView.image = image
        })
    }

    @objc func handleReportTap() {
        uploadAlert(type: self.title!, latitude: String(format: "%f", latitude), longitude: String(format: "%f", longitude), description: self.reportDescription)
    }

    @objc func handleViewTap() {
        textView.resignFirstResponder()
    }

    @objc func handleGalleryTap() {
        imagePicker.allowsEditing = false
        imagePicker.sourceType = .photoLibrary
        present(imagePicker, animated: true, completion: nil)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }    

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        let latestLocation: CLLocation = locations[locations.count - 1]

        self.latitude = latestLocation.coordinate.latitude
        self.longitude = latestLocation.coordinate.longitude
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
        self.button.setTitle("Thank you", for: .normal)

        let date = Date()
        let formatter = DateFormatter()
        formatter.dateFormat = "dd.MM.yyyy HH:mm:ss"
        let time = formatter.string(from: date)
        let parameters = ["type": type, "lon": longitude, "lat": latitude, "description": textView.text, "time": time] as [String : Any]

        //create the url with NSURL
        let url = NSURL(string: "https://i4dyasbtk9.execute-api.us-east-1.amazonaws.com/demo/alert/create")

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
                    if let alertId = json["alertId"] {
                        self.sendImage(id: alertId as! String)
                    }
                }
            } catch let error {
                print(error.localizedDescription)
            }

        })

        task.resume()
    }

    func sendImage(id: String) {
        if let image = imageView.image {
            let url = URL(string: "https://i4dyasbtk9.execute-api.us-east-1.amazonaws.com/demo/alert/image?alertId=\(id)")!
            var request = URLRequest(url: url)
            request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
            request.httpMethod = "POST"
            request.httpBody = UIImageJPEGRepresentation(image, 1)!
            let task = URLSession.shared.dataTask(with: request) { data, response, error in
                guard let data = data, error == nil else {
                    print("error=\(String(describing: error))")
                    return
                }

                if let httpStatus = response as? HTTPURLResponse, httpStatus.statusCode != 200 {
                    print("statusCode should be 200, but is \(httpStatus.statusCode)")
                    print("response = \(String(describing: response))")
                }

                let responseString = String(data: data, encoding: .utf8)
                print("responseString = \(String(describing: responseString))")
            }
            task.resume()
        }
    }
}
