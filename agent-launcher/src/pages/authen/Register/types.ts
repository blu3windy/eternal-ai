enum RegisterType {
    create,
    import,
    introduce
}

enum CreateNewStep {
    backup = "backup",
    confirmKey = "confirmKey",
    confirmPass = "confirmPass"
}

export {
   RegisterType,
   CreateNewStep
}