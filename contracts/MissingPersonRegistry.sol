// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MissingPersonRegistry {
    struct Report {
        string fullName;
        string lastSeenDate;
        string lastSeenLocation;
        string photoUrl;
        address reporter;
        bool exists;
    }

    mapping(uint256 => Report) public reports;
    uint256 public reportCount;

    event NewReport(uint256 reportId, string fullName, string lastSeenDate, string lastSeenLocation, string photoUrl, address indexed reporter);

    constructor() {
        reportCount = 0;
    }
    
    function submitReport(
        string memory _fullName,
        string memory _lastSeenDate,
        string memory _lastSeenLocation,
        string memory _photoUrl
    ) public returns (uint256){
        require(bytes(_fullName).length > 0, "Full name is required");
        require(bytes(_lastSeenDate).length > 0, "Last seen date is required");
        require(bytes(_lastSeenLocation).length > 0, "Last seen location is required");
        require(bytes(_photoUrl).length > 0, "Photo URL is required");

        reportCount += 1;
        reports[reportCount] = Report({
            fullName: _fullName,
            lastSeenDate: _lastSeenDate,
            lastSeenLocation: _lastSeenLocation,
            photoUrl: _photoUrl,
            reporter: msg.sender,
            exists: true
        });

        emit NewReport(reportCount, _fullName, _lastSeenDate, _lastSeenLocation, _photoUrl, msg.sender);

        return reportCount;
    }
    
    function getReport(uint256 _reportId)
        public
        view
        returns (
            string memory fullName,
            string memory lastSeenDate,
            string memory lastSeenLocation,
            string memory photoUrl,
            address reporter
        )
    {
        require(reports[_reportId].exists, "Report does not exist");
        Report memory report = reports[_reportId];
        return (
            report.fullName,
            report.lastSeenDate,
            report.lastSeenLocation,
            report.photoUrl,
            report.reporter
        );
    }
 
    function getTotalReports() public view returns (uint256) {
        return reportCount;
    }
}
