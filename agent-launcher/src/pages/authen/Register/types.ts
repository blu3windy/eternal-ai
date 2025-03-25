enum RegisterType {
    create,
    import,
    introduce
}

enum CreateNewStep {
    backup = "backup",
    confirmKey = "confirmKey",
    confirmPass = "confirmPass",
    setupModel = "setupModel",
}

export {
   RegisterType,
   CreateNewStep
}