const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FileRegistry", function () {
    let FileRegistry, fileRegistry, owner, addr1, addr2;
    const sampleHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    const sampleCid = "bafkreid7qoywk77r7rj3slobqfekdvs57qwuwh5d2z3sqsw52iabe3mqne";

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        FileRegistry = await ethers.getContractFactory("FileRegistry");
        fileRegistry = await FileRegistry.deploy(owner.address);
        await fileRegistry.deployed();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await fileRegistry.hasRole(await fileRegistry.DEFAULT_ADMIN_ROLE(), owner.address)).to.be.true;
        });

        it("Should grant uploader role to admin", async function () {
            expect(await fileRegistry.hasRole(await fileRegistry.UPLOADER_ROLE(), owner.address)).to.be.true;
        });
    });

    describe("File Registration", function () {
        it("Should register a file successfully", async function () {
            await fileRegistry.registerFile(
                sampleHash,
                sampleCid,
                "test.txt",
                1024,
                "text/plain"
            );

            const file = await fileRegistry.getFile(sampleHash);
            expect(file.cid).to.equal(sampleCid);
            expect(file.fileName).to.equal("test.txt");
            expect(file.owner).to.equal(owner.address);
            expect(file.isActive).to.be.true;
        });

        it("Should emit FileRegistered event", async function () {
            await expect(fileRegistry.registerFile(
                sampleHash,
                sampleCid,
                "test.txt",
                1024,
                "text/plain"
            )).to.emit(fileRegistry, "FileRegistered")
              .withArgs(sampleHash, sampleCid, owner.address, "test.txt", anyValue);
        });

        it("Should prevent duplicate registration", async function () {
            await fileRegistry.registerFile(sampleHash, sampleCid, "test.txt", 1024, "text/plain");
            
            await expect(fileRegistry.registerFile(
                sampleHash,
                sampleCid,
                "test2.txt",
                1024,
                "text/plain"
            )).to.be.revertedWith("File already registered");
        });

        it("Should require uploader role", async function () {
            await expect(fileRegistry.connect(addr1).registerFile(
                sampleHash,
                sampleCid,
                "test.txt",
                1024,
                "text/plain"
            )).to.be.reverted;
        });
    });

    describe("File Verification", function () {
        beforeEach(async function () {
            await fileRegistry.registerFile(sampleHash, sampleCid, "test.txt", 1024, "text/plain");
        });

        it("Should verify existing file", async function () {
            const [exists, isActive] = await fileRegistry.verifyFile(sampleHash);
            expect(exists).to.be.true;
            expect(isActive).to.be.true;
        });

        it("Should return false for non-existent file", async function () {
            const nonExistentHash = "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";
            const [exists, isActive] = await fileRegistry.verifyFile(nonExistentHash);
            expect(exists).to.be.false;
            expect(isActive).to.be.false;
        });
    });

    describe("Access Control", function () {
        it("Should allow admin to grant uploader role", async function () {
            await fileRegistry.grantUploaderRole(addr1.address);
            expect(await fileRegistry.hasRole(await fileRegistry.UPLOADER_ROLE(), addr1.address)).to.be.true;
        });

        it("Should prevent non-admin from granting roles", async function () {
            await expect(fileRegistry.connect(addr1).grantUploaderRole(addr2.address)).to.be.reverted;
        });
    });
});
