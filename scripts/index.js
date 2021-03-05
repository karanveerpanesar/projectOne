const URL = location.origin; // root domain

// redirects
$("#go-p0").on("click", e => {
    window.location.assign(`${URL}/pages/p0.html`);
});
$("#src-p0").on("click", e => {
    window.location="https://github.com/karanveerpanesar/projectZero";
});
$("#det-p0").on("click", e => {
    window.location="https://sway.office.com/8FDg5CglQVrOMBaz?ref=Link&loc=mysways";
});
$("#go-p1").on("click", e => {
    window.location.assign(`${URL}/pages/p1.html`);
});
$("#src-p1").on("click", e => {
    window.location="https://github.com/karanveerpanesar/projectOne";
});
$("#det-p1").on("click", e => {
    window.location="https://sway.office.com/RfDRi8dRVDp4TZfB?ref=Link";
});
