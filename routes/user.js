const router = require('express').Router();

const { validatePatchUser } = require('../middlewares/validation');
const {
  aboutMe,
  updateUserInfo,
} = require('../controllers/user');

router.get('/me', aboutMe);
router.patch('/me', validatePatchUser, updateUserInfo);

module.exports = router;
