/**
 * @typedef {{x: number, y: number, width: number, height: number}} Position 
 * @typedef {{leftX: number, rightX: number, topY: number, bottomY: number}} WindowPosition
 */


document.addEventListener('DOMContentLoaded', main)
const TOOLTIP_GAP = 4;

/**
 * @param {Element} element 
 * @returns {Position}
 */
function calculateElementPosition(element) {
    const bodyRect = document.body.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    return {
        x: elementRect.left - bodyRect.left,
        y: elementRect.top - bodyRect.top,
        width: elementRect.width,
        height: elementRect.height
    }
}

/**
 * 
 * @returns {WindowPosition}
 */
function calculateWindowPositions() {
    const currentScrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const currentScrollX = window.scrollX;
    const windowWidth = window.innerWidth;

    return {
        leftX: currentScrollX,
        rightX: currentScrollX + windowWidth,
        topY: currentScrollY,
        bottomY: currentScrollY + windowHeight
    }
}

function main() {
    const elementsWithTooltip = document.querySelectorAll('[tooltip]');

    generateToolTips(elementsWithTooltip);
    calculateTooltipsPositions(elementsWithTooltip);

    document.addEventListener('scroll', function () { calculateTooltipsPositions(elementsWithTooltip) });
}

/**
 * @param {NodeListOf<Element>} elementsWithTooltip 
 */
function generateToolTips(elementsWithTooltip) {
    const popoverContainer = document.getElementById('popover-container');

    elementsWithTooltip.forEach(element => {
        const tooltipContent = element.getAttribute("tooltip");
        const tooltip = tooltipTemplate(tooltipContent);

        element.setAttribute("tooltip-id", tooltip.id);
        element.onmouseover = showTooltip
        element.onmouseout = hideTooltip

        popoverContainer.appendChild(tooltip);
    });

}

/**
 * @param {NodeListOf<Element>} elementsWithTooltip 
 */
function calculateTooltipsPositions(elementsWithTooltip) {

    elementsWithTooltip.forEach(element => {
        const tooltipId = element.getAttribute("tooltip-id");
        const tooltip = document.getElementById(tooltipId);

        const elementPositions = calculateElementPosition(element);
        const tooltipPositions = calculateElementPosition(tooltip);
        const windowPositions = calculateWindowPositions();

        const defaultTooltipYCoord = elementPositions.y + elementPositions.height + TOOLTIP_GAP;
        let tooltipYCoord = defaultTooltipYCoord;

        const tooltipIsAboveWindow = windowPositions.topY > defaultTooltipYCoord;
        if (tooltipIsAboveWindow) {
            tooltipYCoord = windowPositions.topY + TOOLTIP_GAP;
        }

        const tooltipIsBelowWindow = windowPositions.bottomY < (defaultTooltipYCoord + tooltipPositions.height);
        if (tooltipIsBelowWindow) {
            tooltipYCoord = Math.min(elementPositions.y - tooltipPositions.height - TOOLTIP_GAP, windowPositions.bottomY - tooltipPositions.height - TOOLTIP_GAP);
        }

        const defaultTooltipXCoord = (elementPositions.width / 2) + elementPositions.x - (tooltipPositions.width / 2)
        let tooltipXCoord = defaultTooltipXCoord;

        const tooltipIsLeftOfWindow = defaultTooltipXCoord < windowPositions.leftX;
        if(tooltipIsLeftOfWindow) {
            tooltipXCoord = windowPositions.leftX + TOOLTIP_GAP;
        }

        const tooltipIsRightOfWindow = defaultTooltipXCoord + tooltipPositions.width > windowPositions.rightX;
        if(tooltipIsRightOfWindow) {
            tooltipXCoord = windowPositions.rightX - tooltipPositions.width - TOOLTIP_GAP;
        }

        tooltip.style.top = `${tooltipYCoord}px`;
        tooltip.style.left = `${tooltipXCoord}px`;
    });
    
}   

/**
 * @param {Event} event 
 */
function showTooltip(event) {
    const tooltipId = event.target.getAttribute("tooltip-id");
    const tooltip = document.getElementById(tooltipId);

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
