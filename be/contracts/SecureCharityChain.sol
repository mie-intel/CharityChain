// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CharityChain {

    address public admin;
    uint public targetDonasi;
    uint public donasiTerkumpul;
    uint public batasWaktuDonasi;
    
    mapping(address => uint) public jumlahDonasi;

    // Event untuk mencatat kegiatan donasi
    event Donasi(address indexed donor, uint amount);
    event TarikDonasi(address indexed admin, uint amount);
    event DonasiTercapai(uint totalAmount);

    // Modifier untuk memeriksa apakah admin adalah penggalang dana
    modifier isAdmin() {
        require(msg.sender == admin, "Anda bukan Admin !");
        _;
    }

    // Modifier untuk memeriksa apakah donasi sudah selesai
    modifier donasiSelesai() {
        require(block.timestamp >= batasWaktuDonasi, "Periode donasi belum berakhir !");
        _;
    }

    // Constructor untuk menginisialisasi Smart Contract
    constructor(uint _targetDonasi, uint _durasi) {
        admin = msg.sender;
        targetDonasi = _targetDonasi;
        donasiTerkumpul = 0;
        batasWaktuDonasi = block.timestamp + _durasi;
    }

    // Function untuk berdonasi
    function donasi() external payable {
        require(block.timestamp < batasWaktuDonasi, "Periode donasi telah berakhir !");
        require(msg.value > 0, "Nominal donasi harus lebih dari 0 !");

        jumlahDonasi[msg.sender] += msg.value;
        donasiTerkumpul += msg.value;

        emit Donasi(msg.sender, msg.value);

        // Jika target sudah tercapai, kirim event
        if (donasiTerkumpul >= targetDonasi) {
            emit DonasiTercapai(donasiTerkumpul);
        }
    }

    // Function untuk mengambil donasi oleh admin
    function tarikDonasi() external isAdmin donasiSelesai {
        uint amount = donasiTerkumpul;
        donasiTerkumpul = 0;
        
        require(donasiTerkumpul >= targetDonasi, "Target amount not reached");
        
        payable(admin).transfer(amount);
        
        emit TarikDonasi(admin, amount);
    }

    // Function untuk mendapatkan sisa durasi dari periode donasi
    function sisaDurasi() external view returns (uint) {
        if (block.timestamp >= batasWaktuDonasi) {
            return 0;
        } else {
            return batasWaktuDonasi - block.timestamp;
        }
    }

    // Function untuk mengecek total donasi yang sudah terkumpul
    function getDonasiTerkumpul() external view returns (uint) {
        return donasiTerkumpul;
    }

    // Function untuk mengecek target donasi
    function getTargetDonasi() external view returns (uint) {
        return targetDonasi;
    }

    // Function untuk mengecek apakah nominal target sudah tercapai
    function isDonasiTercapai() external view returns (bool) {
        return donasiTerkumpul >= targetDonasi;
    }
}
