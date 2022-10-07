const passwordValidtor = (password) => {
    return /^(?!.*[#!])(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(password)

}


module.exports = passwordValidtor;