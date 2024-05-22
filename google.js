function hasChildWithText(element, text) {
    if (!element || !text) {
      return false;
    }
      const targetText = text.toLowerCase();
      function checkChildNodes(node) {
      for (let child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE && child.textContent.trim().toLowerCase() === targetText) {
          return true;
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          if (checkChildNodes(child)) {
            return true;
          }
        }
      }
      return false;
    }
  
    return checkChildNodes(element);
  }



function fetchGoogle(search) {
    return fetch(`https://cors-anywhere.herokuapp.com/https://www.google.com/search?q=${search}`)
    .then(response => {
        console.log(response.status)
        return response.text()
    })
    .then(data => {
        const parser = new DOMParser();
        const document = parser.parseFromString(data, 'text/html');

        const titles = document.querySelectorAll('div.yuRUbf h3.LC20lb.MBeuO.DKV0Md');
        const displayURL = document.querySelectorAll('div.byrV5b cite.tjvcx.GvPZzd.cHaqb');
        const discriptions = document.querySelectorAll('div[data-snf="nke7rc"][data-sncf="1"].kb0PBd.cvP2Ce.A9Y9g div.VwiC3b.yXK7lf.lVm3ye.r025kc.hJNv6b.Hdw6tb');

        information = {}
        console.log(titles)
        for(let i = 0; i < titles.length; i++) {
            information[titles[i].innerText] = {
                url: titles[i].href,
                ad: hasChildWithText(titles[i].parentElement.parentElement, "Sponsored"),
                displayUrl: displayURL[i].innerText,
                description: discriptions[i].innerText,
            }
        }
        return information
    })
    .catch(error => console.log('Error:', error));
}