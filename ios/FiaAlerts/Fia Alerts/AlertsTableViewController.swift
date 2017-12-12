//
//  AlertsTableViewController.swift
//  Fia Alerts
//
//  Created by Jukka Miettinen on 28/11/2017.
//  Copyright © 2017 Nitor. All rights reserved.
//

import UIKit

class AlertsTableViewController: UITableViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 12
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return 1
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let currentCell = tableView.cellForRow(at: indexPath)
        let viewController = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "Report") as! ReportViewController
        viewController.label = currentCell?.textLabel!.text! as String!
        navigationController?.pushViewController(viewController, animated: true)
    }
}
