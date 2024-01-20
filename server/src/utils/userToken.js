const jwt = require("jsonwebtoken");

const singUserToken = (id) => {
    return jwt.sign({ id: id }, process.env.SECRET, {
        expiresIn: process.env.TOKEN_EXPARATION,
    });
};

exports.createAndSendToken = (user, statusCode, res) => {
    const token = singUserToken(user._id);

    const cookieOptions = {
        expiresIn: new Date(Date.now() + process.env.TOKEN_EXPARATION * 24 * 60 * 60 * 10000),
        httpOnly: true,
        secure: true,
    };

    res.cookie("jwt", token, cookieOptions);
    user.password = undefined;

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};
