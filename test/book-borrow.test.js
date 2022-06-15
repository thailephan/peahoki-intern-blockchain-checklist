const { expect } = require("chai");
const { ethers } = require("hardhat");

const initBooks = [
    {
        id: 1,
        value: 2,
    },
    {
        id: 2,
        value: 10,
    },
    {
        id: 3,
        value: 0,
    },
    {
        id: 4,
        value: 7,
    },
    {
        id: 5,
        value: 10,
    },
];

async function getDeployContract() {
    const BookBorrow = await ethers.getContractFactory("BookBorrow");
    const bookBorrow = await BookBorrow.deploy();
    await bookBorrow.deployed();

    return bookBorrow;
}

async function getSigners() {
    return await ethers.getSigners();
}

describe("BookBorrow contract", function () {
    describe('name function', () => {
      it("Should get right name of contract", async function () {
        const bookBorrow = await getDeployContract();

        expect(await bookBorrow.name()).to.equal("Borrowing books");
      });
    })

    describe("function:borrowBook - No book is borrowed", () => {
        it("No book left to borrow", async function () {
            const EXPECT_BORROW_BOOK_REVERT = "BookBorrowing: No book left to borrow";
            const EXPECT_ADDR1_BOOK = 0;

            const bookBorrow = await getDeployContract();
            const [, addr1] = await getSigners();

            const thirdBook = initBooks[2];

            await expect(
                bookBorrow.borrowBook(addr1.address, thirdBook.id),
            ).to.be.revertedWith(EXPECT_BORROW_BOOK_REVERT);

            expect(
                await bookBorrow.balanceOf(addr1.address, thirdBook.id),
            ).to.be.equal(EXPECT_ADDR1_BOOK);
        });

        it("Book id < 0", async function () {
            const TEST_BOOK_ID = -1;
            const EXPECT_BORROW_BOOK_ERROR = "value out-of-bounds";
            const EXPECT_ADDRESS_BOOK = 0;

            const bookBorrow = await getDeployContract();

            const firstBook = initBooks[0];
            const [, addr1] = await getSigners();

            try {
                const _ = await bookBorrow.borrowBook(
                    addr1.address,
                    TEST_BOOK_ID,
                );
            } catch (error) {
                expect(error.message, EXPECT_BORROW_BOOK_ERROR);
            }

            expect(
                await bookBorrow.balanceOf(addr1.address, firstBook.id),
            ).to.be.equal(EXPECT_ADDRESS_BOOK);
        });

        it("Book id = 0", async function () {
            const TEST_BOOK_ID = 0;
            const EXPECT_BORROW_BOOK_REVERT = "BookBorrowing: No book left to borrow";

            const bookBorrow = await getDeployContract();

            const [, addr1] = await getSigners();

            await expect(
                bookBorrow.borrowBook(addr1.address, TEST_BOOK_ID),
            ).to.be.revertedWith(EXPECT_BORROW_BOOK_REVERT);
        });

        it("Book id > 0", async function () {
            const firstBook = initBooks[0];
            const secondBook = initBooks[1];

            const bookBorrow = await getDeployContract();
            const [signer, addr1, addr2] = await getSigners();

            const INITIAL_FIRST = await bookBorrow.balanceOf(signer.address, firstBook.id);
            const INITIAL_SECOND = await bookBorrow.balanceOf(signer.address, secondBook.id);
            const EXPECT_ADDR1_BOOK = 1;
            const EXPECT_ADDR2_BOOK = 1;

            const borrowFirstBookTx = await bookBorrow.borrowBook(
                addr1.address,
                firstBook.id,
            );

            const borrowSecondBookTx = await bookBorrow.borrowBook(
                addr2.address,
                secondBook.id,
            );

            // wait until the transaction is mined
            await borrowFirstBookTx.wait();
            await borrowSecondBookTx.wait();

            expect(
                await bookBorrow.balanceOf(addr1.address, firstBook.id),
            ).to.be.equal(EXPECT_ADDR1_BOOK);
            expect(
                await bookBorrow.balanceOf(addr2.address, secondBook.id),
            ).to.be.equal(EXPECT_ADDR2_BOOK);

            expect(
                await bookBorrow.balanceOf(signer.address, firstBook.id),
            ).to.be.equal(INITIAL_FIRST.sub(EXPECT_ADDR1_BOOK));
            expect(
                await bookBorrow.balanceOf(signer.address, secondBook.id),
            ).to.be.equal(INITIAL_SECOND - EXPECT_ADDR2_BOOK);
        });
    });

    describe("function:borrowbook - Borrower has borrow a book before", () => {
        it("Borrower has borrows book", async function () {
            const INIT_ADDR1_BOOK = 0;
            const EXPECT_BORROW_BOOK_REVERT = "BorrowingBook()";
            const EXPECT_ADDR1_BOOK = 1;

            const bookBorrow = await getDeployContract();
            const [, addr1] = await getSigners();

            const firstBook = initBooks[0];

            expect(
                await bookBorrow.balanceOf(addr1.address, firstBook.id),
            ).to.be.equal(INIT_ADDR1_BOOK);

            const borrowBookTx1 = await bookBorrow.borrowBook(
                addr1.address,
                firstBook.id,
            );

            await borrowBookTx1.wait();

            expect(
                await bookBorrow.balanceOf(addr1.address, firstBook.id),
            ).to.be.equal(EXPECT_ADDR1_BOOK);
            await expect(
                bookBorrow.borrowBook(addr1.address, firstBook.id),
            ).to.be.revertedWith(EXPECT_BORROW_BOOK_REVERT);

            expect(
                await bookBorrow.balanceOf(addr1.address, firstBook.id),
            ).to.be.equal(EXPECT_ADDR1_BOOK);
        });
    });

    // describe("function:uri", () => {
    //     it("Bad id input", async function () {
    //         const EXPECT_OUT_OF_RANGE = "value out-of-bounds";
    //         try {
    //             const bookBorrow = await getDeployContract();
                
    //             const URI_ID = -1;
                
    //             const _ = await bookBorrow.getUri(URI_ID); 
    //         } catch (error) {
    //             expect(error.message, EXPECT_OUT_OF_RANGE);
    //         }
    //     });

    //     it("Good id input", async function () {
    //         const bookBorrow = await getDeployContract();
            
    //         const URI_ID = 1;
    //         const GET_URI = await bookBorrow.getUri(URI_ID); 
    //         const EXPECT_URI = await bookBorrow.uri(URI_ID) + URI_ID;

    //         expect(GET_URI).to.be.equal(EXPECT_URI);
    //     });
    // });

    describe('function:returnBookBack', () => { 
        it("Borrower give back a book that not borrow", async function () {
           const bookBorrow = await getDeployContract();
            
           const EXPECT_REVERT = "BookBorrowing: Not borrow any to return";

          await expect(bookBorrow.returnBookBack()).to.be.revertedWith(EXPECT_REVERT);
        });

        it("Borrower give back a book that borrowed", async function () {
           const bookBorrow = await getDeployContract();
            
           const [, addr1, ] = await getSigners();
           const firstBook = initBooks[0];
           const EXPECT_BORROW_BOOK = 1;
           const EXPECT_RETURN_BOOK = 0;

           const borrowBookTx = await bookBorrow.borrowBook(
               addr1.address,
               firstBook.id,
           );

           await borrowBookTx.wait();

           const balanceAfterBorrowBook = await bookBorrow.balanceOf(addr1.address, firstBook.id);

           expect(balanceAfterBorrowBook).to.be.equal(EXPECT_BORROW_BOOK);

           const returnBookTx = await bookBorrow.connect(addr1).returnBookBack();
           await returnBookTx.wait();

           expect(
               await bookBorrow.balanceOf(addr1.address, firstBook.id),
           ).to.be.equal(EXPECT_RETURN_BOOK);
        });
     })
});

