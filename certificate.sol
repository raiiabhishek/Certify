// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateManager {

    struct Certificate {
        string templateId; // ID referencing MongoDB document
        mapping(string => string) certificateInfo;
        address creator;
        bool exists; // Added a flag to indicate if the certificate exists
    }

    uint256 public certificateCounter;
    mapping(uint256 => Certificate) public certificates;


    event CertificateCreated(
        uint256 indexed certificateId,
        address creator,
        string templateId
    );
    event CertificateDeleted(uint256 indexed certificateId);


    function createCertificate(string memory _templateId, string[] memory _keys, string[] memory _values) public  {
       require(_keys.length == _values.length, "Keys and values must have same length");

       Certificate memory newCertificate;
       newCertificate.templateId = _templateId;
       newCertificate.creator = msg.sender;
        newCertificate.exists = true; // Set the existence flag

       for(uint256 i = 0; i < _keys.length; i++){
            newCertificate.certificateInfo[_keys[i]] = _values[i];
        }
        certificateCounter++;
        certificates[certificateCounter] = newCertificate;
        emit CertificateCreated(certificateCounter, msg.sender, _templateId);

    }

    function getCertificateInfo(uint256 _certificateId) public view returns (string memory templateId, string[] memory keys, string[] memory values ) {
       require(certificates[_certificateId].exists, "Certificate does not exist"); //Ensure certificate exists before trying to access it
       Certificate storage certificate = certificates[_certificateId];
       templateId = certificate.templateId;
       
        keys = new string[](certificate.certificateInfo.length);
        values = new string[](certificate.certificateInfo.length);

       uint256 index = 0;
         for (bytes32 j; uint256(j) < 2**256; j = bytes32(uint256(j) + 1)) {
             if(bytes(certificate.certificateInfo[string(j)]).length > 0)
                  {
                     keys[index] = string(j);
                     values[index] = certificate.certificateInfo[string(j)];
                     index++;
                 }
            }

        
    }
    function deleteCertificate(uint256 _certificateId) public {
        require(certificates[_certificateId].exists, "Certificate does not exist");
        delete certificates[_certificateId];
        emit CertificateDeleted(_certificateId);

    }


}