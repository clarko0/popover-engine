document.addEventListener('DOMContentLoaded', main)

function main() {
    const elementsWithTooltip = document.querySelectorAll('[tooltip]');
    const popoverContainer = document.getElementById('popover-container');
    const bodyRect = document.body.getBoundingClientRect()

    elementsWithTooltip.forEach(element => {
        const tooltipContent = element.getAttribute("tooltip");
        const tooltip = tooltipTemplate(tooltipContent);
        element.setAttribute("tooltip-id", tooltip.id);
        popoverContainer.appendChild(tooltip);
        
        const elementRect = element.getBoundingClientRect();
        const elementYCoord = elementRect.top - bodyRect.top;
        const elementXCoord = elementRect.left - bodyRect.left;
        const elementHeight = elementRect.height;
        const elementWidth = elementRect.width;

        const windowWidth = window.innerWidth;

        const tooltipRect = tooltip.getBoundingClientRect();
        const tooltipWidth = tooltipRect.width;
        const tooltipYCoord = elementYCoord + elementHeight;
        const tooltipXCoord = Math.min(Math.max((elementWidth / 2) + elementXCoord - (tooltipWidth / 2), 0), windowWidth - tooltipWidth);

        tooltip.style.top = `${tooltipYCoord}px`;
        tooltip.style.left = `${tooltipXCoord}px`;

        element.onmouseover = showTooltip
        element.onmouseout = hideTooltip
    });
}

/**
 * @param {Event} event 
 */
function showTooltip(event) {
    const tooltipId = event.target.getAttribute("tooltip-id");
    const tooltip = document.getElementById(tooltipId);

    console.log(tooltip)

    tooltip.classList.add("visible");
}

function hideTooltip(event) {
    const tooltipId = event.target.getAttribute("tooltip-id");
    const tooltip = document.getElementById(tooltipId);

    tooltip.classList.remove("visible");
}

function tooltipTemplate(tooltipContent) {
    const id = generateHexString(24);
    const tooltip = html`
        <div id="${id}" class="tooltip">${tooltipContent}</div>
    `;

    return tooltip;
}

function generateHexString(length) {
    const characters = '0123456789abcdef';
    let hexString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      hexString += characters[randomIndex];
    }
    return hexString;
}

function html(strings, ...values) {
    const parsedArgs = strings.reduce((result, string, i) => result + string + (values[i] || ''), '');
    const parser = new DOMParser();
    const doc = parser.parseFromString(parsedArgs, 'text/html');

    const newElement = doc.body.firstChild;
    return newElement;
}