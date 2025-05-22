// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CharityChainVulnerable {

    address public admin;
    uint public targetDonasi;
    uint public donasiTerkumpul;
    uint public batasWaktuDonasi;
    
    mapping(address => uint) public jumlahDonasi;

    // Event untuk mencatat kegiatan donasi
    event Donasi(address indexed donor, uint amount);
    event TarikDonasi(address indexed admin, uint amount);
    event DonasiTercapai(uint totalAmount);

    // Constructor tanpa setting admin sebagai pengelola yang ketat
    constructor(uint _targetDonasi, uint _durasi) {
        admin = msg.sender;
        targetDonasi = _targetDonasi;
        donasiTerkumpul = 0;
        batasWaktuDonasi = block.timestamp + _durasi;
    }

    // Fungsi donasi tanpa validasi waktu dan nilai donasi
    function donasi() external payable {
        jumlahDonasi[msg.sender] += msg.value;
        donasiTerkumpul += msg.value;

        emit Donasi(msg.sender, msg.value);

        if (donasiTerkumpul >= targetDonasi) {
            emit DonasiTercapai(donasiTerkumpul);
        }
    }

    // Fungsi tarikDonasi tanpa modifier kontrol admin dan tanpa proteksi reentrancy
    function tarikDonasi() external {
        require(donasiTerkumpul >= targetDonasi, "Target amount not reached");
        
        // Transfer dana sebelum reset saldo, rentan reentrancy attack!
        payable(msg.sender).transfer(donasiTerkumpul);
        
        donasiTerkumpul = 0;
        
        emit TarikDonasi(msg.sender, donasiTerkumpul);
    }
}
