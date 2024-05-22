var tableHTML = `
<tr>
  <td></td>
  <th>Searchie</th>
  <th>C1</th>
</tr>
<tr>
  <td>Total Links
    <span onclick="showHide(this)">
      <p class="explanation">Explain</p>
      <p class="explanation_text">This section explains the number of total links retrieved from the search engine. It represents the overall quantity of search results returned for the given search query. More total links might indicate broader coverage, potentially offering users a wider range of options. However, it could also raise privacy concerns, as more links mean more potential data tracking and exposure to malicious websites.</p>
    </span>                 
  </td>
  <td>S1</td>
  <td>C2</td>
</tr>
<tr>
  <td>Ads
    <span onclick="showHide(this)">
      <p class="explanation">Explain</p>
      <p class="explanation_text">Ads indicate the presence of sponsored content within search results. Encountering more ads on search engines may impact user privacy by potentially tracking user behavior for targeted advertising. Moreover, excessive ads could obscure organic search results, affecting the user experience and potentially leading to unintentional clicks on malicious links.</p>
    </span>
  </td>
  <td>0</td>
  <td>C3</td>
</tr>
<tr>
  <td>Direct Link
    <span onclick="showHide(this)">
      <p class="explanation">Explain</p>
      <p class="explanation_text">Direct links allow users to navigate directly to a website from the search results without intermediaries. Prioritizing direct links can enhance user privacy and security by reducing exposure to third-party trackers and potential phishing attempts. However, the absence of direct links may lead to privacy risks associated with passing through additional tracking mechanisms or intermediary pages before reaching the desired website.</p>
    </span>
  </td>
  <td>S1</td>
  <td>C4</td>
</tr>
`

function closeText() {
  const blob = document.getElementById("blob");
  const allDis = document.getElementsByClassName("explanation_text")
  for (let i = 0; i < allDis.length; i++) {
    allDis[i].style.display = "none";
  }
}
closeText()

function showHide(ele) {
  children = ele.querySelectorAll('*')[1]
  if (children.style.display === "none") {
    children.style.display = "block";
  } else {
    children.style.display = "none";
  }
}

const updateBlobPosition = event => {
  const { clientX, clientY } = event;

  blob.animate({
    left: `${clientX}px`,
    top: `${clientY}px`
  }, { duration: 3000, fill: "forwards" });
}

// Add event listeners to explanation spans
document.querySelectorAll('.explanation').forEach(item => {
  item.addEventListener('click', event => {
    // Toggle the display of explanation section
    const explanationSection = item.parentNode.nextElementSibling;
    explanationSection.classList.toggle('show');
  });
});


async function key_down(e) {
  if(e.keyCode === 13) {
    var dropdown = document.getElementById("dropdown").value
    var search = document.getElementById("input").value

    document.getElementById("iframe1").src = `https://search.byteoftech.net/?q=${search}`
    const response = await fetch(`https://cors-proxy.byteoftech.net/https://search.byteoftech.net/?q=${search}&format=json`);
    const searxJSON = await response.json();

    newTable = tableHTML.replace("S1", searxJSON["results"].length)
    newTable = newTable.replace("S1", searxJSON["results"].length)

    if (dropdown == "duckduckgo") {
      existingHtmlElement = document.getElementById("iframe2")
      existingHtmlElement.outerHTML = `<iframe class="iframe2" id="iframe2" is="x-frame-bypass" src="https://html.duckduckgo.com/html/?q=${search}"></iframe>`
      parsedJson = await fetchDuck(search)
      newTable = newTable.replace("C1", "Duck Duck Go")
    }

    if (dropdown == "google") {
      existingHtmlElement = document.getElementById("iframe2")
      existingHtmlElement.outerHTML = `<iframe class="iframe2" id="iframe2" src="https://google.com/search?igu=1&q=${search}"></iframe>`
      parsedJson = await fetchGoogle(search)
      newTable = newTable.replace("C1", "Google")
    }

    if (dropdown == "bing") {
      existingHtmlElement = document.getElementById("iframe2")
      existingHtmlElement.outerHTML = `<iframe class="iframe2" id="iframe2" src="https://www.bing.com/search?q=${search}"></iframe>`
      parsedJson = await fetchBing(search)
      newTable = newTable.replace("C1", "Bing")
    }

    console.log(parsedJson)
    adCount = 0
    directLink = 0
    totalLinks = 0

    for (const [key, value] of Object.entries(parsedJson)) {
      totalLinks ++

      if (value["ad"]) {
        adCount ++
      }

      if (value["displayUrl"] === value["url"]) {
        directLink ++
      }
    }

    newTable = newTable.replace("C2", String(totalLinks))
    newTable = newTable.replace("C3", String(adCount))
    newTable = newTable.replace("C4", String(directLink))


    var element = document.getElementById("table")
    element.innerHTML = newTable
    closeText()
  }
}


document.addEventListener('pointermove', updateBlobPosition);
document.addEventListener('keydown', key_down);