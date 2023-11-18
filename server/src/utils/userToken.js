const jwt = require("jsonwebtoken");
const { secret, configExpiresIn } = require("../config");

const singUserToken = (id) => {
    return jwt.sign({ id: id }, secret, {
        expiresIn: configExpiresIn,
    });
};

exports.createAndSendToken = (user, statusCode, res) => {
    const token = singUserToken(user._id);

    const cookieOptions = {
        expiresIn: new Date(Date.now() + configExpiresIn * 24 * 60 * 60 * 10000),
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
