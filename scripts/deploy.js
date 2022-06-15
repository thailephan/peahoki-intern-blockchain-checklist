const hre = require("hardhat");

async function main() {
  const BookBorrow = await hre.ethers.getContractFactory("BookBorrow");
  const bookBorrow = await BookBorrow.deploy();

  await bookBorrow.deployed();

  console.log("BookBorrow deployed to:", bookBorrow.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
