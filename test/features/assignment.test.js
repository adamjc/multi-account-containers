describe("Assignment Feature", () => {
  const url = "http://example.com";

  let activeTab;
  beforeEach(async () => {
    activeTab = await helper.browser.initializeWithTab({
      cookieStoreId: "firefox-container-1",
      url
    });
  });

  describe("click the 'Always open in' checkbox in the popup", () => {
    beforeEach(async () => {
      // popup click to set assignment for activeTab.url
      await helper.popup.clickElementById("container-page-assigned");
    });

    describe("open new Tab with the assigned URL in the default container", () => {
      let newTab;
      beforeEach(async () => {
        // new Tab opening activeTab.url in default container
        newTab = await helper.browser.openNewTab({
          cookieStoreId: "firefox-default",
          url
        }, {
          options: {
            webRequestError: true // because request is canceled due to reopening
          }
        });
      });

      it("should open the confirm page", async () => {
        // should have created a new tab with the confirm page
        background.browser.tabs.create.should.have.been.calledWithMatch({
          url: "moz-extension://fake/confirm-page.html?" +
               `url=${encodeURIComponent(url)}` +
               `&cookieStoreId=${activeTab.cookieStoreId}`,
          cookieStoreId: undefined,
          openerTabId: null,
          index: 2,
          active: true
        });
      });

      it("should remove the new Tab that got opened in the default container", () => {
        background.browser.tabs.remove.should.have.been.calledWith(newTab.id);
      });
    });

    describe("click the 'Always open in' checkbox in the popup again", () => {
      beforeEach(async () => {
        // popup click to remove assignment for activeTab.url
        await helper.popup.clickElementById("container-page-assigned");
      });

      describe("open new Tab with the no longer assigned URL in the default container", () => {
        beforeEach(async () => {
          // new Tab opening activeTab.url in default container
          await helper.browser.openNewTab({
            cookieStoreId: "firefox-default",
            url
          });
        });

        it("should not open the confirm page", async () => {
          // should not have created a new tab
          background.browser.tabs.create.should.not.have.been.called;
        });
      });
    });
  });

  describe("manually adding a site", () => {
    it("should assign the site to the container when a site is added into the input field and the 'add' button is pressed", async () => {
      // We need to add a container so we can use this._editForm information
      // Then _check_ the container has the correct information

      popup.document.getElementById("edit-container-panel-name-input").value = "a container"
      console.log(popup.document.getElementById("edit-container-panel-form"))
      popup.document.getElementById("add-site-input").value = "https://www.mozilla.org"
      await nextTick();

      
      await helper.popup.clickElementById("add-site-button");

      // console.log(browser.storage.local);
    })

    it("should open the site in the container it has been assigned to when a new tab opens the site URL", () => {
      // Make a new tab with that URL
      // See if the tab is in the correct container
    })
  });
});
