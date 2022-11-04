const simulateMouseHover = async (driver, elementToHover) => {
    const actions = driver.actions({async: true});
    await actions.move({origin:elementToHover}).perform();
};

module.exports = simulateMouseHover;
