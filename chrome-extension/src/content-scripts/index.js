var elementToInsert = document.createElement("h1");
elementToInsert.textContent = "This text comes from my content script.";
document.body.insertBefore(elementToInsert, document.body.firstChild);
