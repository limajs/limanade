describe("Smoke Test", function () {
    it("Smokes", function () {
        expect(true).to.be(true);
    });

    it("This one is Pending");

    it("Fails", function () {
        expect(true).to.be(false);
    });

    it("This one fails", function () {
        expect('Chalk').to.be('Cheese');
    });
});
