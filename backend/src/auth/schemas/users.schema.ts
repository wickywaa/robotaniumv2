import * as mongoose from 'mongoose';
import validator from 'validator';
import { IUserMethods, User, UserModel, IEmailConfirmationDto, PublicProfile, IForgotPasswordDto } from '../interfaces';
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

export const UserSchema = new mongoose.Schema<User, UserModel, IUserMethods>({
  email:{
    type:String,
    required: true,
    unique:true,
    validate(value){
      if(!validator.isEmail(value)) {
        throw new Error(`${value} is not a valid email`)
      }
    }
  },
  isRobotaniumAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  isPlayerAdmin: {
    required: true,
    default: false,
    type: Boolean,
  },
  password: {
    validate(value){
      if(!validator.isStrongPassword(value)) {
        //{ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }
        throw new Error(`${value} is not a valid password you need atleast 1 upper and lower case 1 special character and a minimum length of 8 characters`)
      }
    },
    type:String,
    required: true,
  },
  userName: {
    type: String,
    unique: false,
    required: true,
    min:[1, "username can be a maximum of 1 character long"],
    max:[6, "username can be a maximum of 20 characters long"],
  },

  registrationToken: {
    type: String,
    min:[1, "registration must be 6 characters"],
    max:[6, "registration must be 6 characters"]
  },
  authTokens: {
    type: [],
  },
  passwordResetToken: {
    type: String,
  },
  imgsrc: {
    type: String,
    max:[100, "img url must be max of 100 characters long"]
  },
  isActive: {
    required: true,
    default: true,
    type: Boolean,
  },
  isEmailVerified: {
    required: true,
    default: true,
    type: Boolean,
  },
  changePassword: {
    required: true,
    default: false,
    type: Boolean,
  },

  rememberme: {
    required: true,
    default: false,
    type: Boolean
  },
  theme: {
    required: false,
    default: 'dark',
    type: String,
    validate(theme){
      if (theme === 'dark' || theme == 'light' || theme === null) {
        return true
      }
      throw new Error(`only light and dark themes can be set theme is ${theme}`)
    },
  },
});

UserSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

UserSchema.post('save', function(error, doc, next) {
  if ( error.code === 11000 ) {
    if(error?.keyValue?.email) {
      next(new Error(`The email ${error.keyValue.email } is already taken`));
    }
  } else {
    next(error);
  }
});

UserSchema.method('generateAuthToken',async function generateAuthToken():Promise<string> {
  const user = this;
  const token: string = jwt.sign({_id:user._id.toString()},'supersecretpassword');
  const time = new Date().getTime();
  const validtokens = user.authTokens.filter((token)=>{
    const decoded  = jwt.verify(token,'supersecretpassword');
    return (time - (decoded.iat*1000)  <= 600000) 
  })
  user.authTokens = [...validtokens,token];
  await user.save()

  return token;
});

UserSchema.method('getPublicProfile',async function getPublicProfile(): Promise<PublicProfile> {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.authTokens;
  delete userObject.passwordResetToken;
  delete userObject.registrationToken;
  
  return userObject;
});

UserSchema.method('generateConfirmEmailDto',async  function generateConfirmEmailDto():Promise<IEmailConfirmationDto> {
  const user = this;
  const token:string =  Math.floor(100000 + Math.random() * 900000).toString();
  user.registrationToken = await bcrypt.hash(token, 8);
  await user.save();

  return {
    registrationToken: user.registrationToken,
    email: user.email,
  }
});

UserSchema.method('confirmEmail',async function confirmEmail(confirmEmaildto:IEmailConfirmationDto):Promise<boolean> {
  const user = this;

  const tokenMatches = await user.registrationToken ===  confirmEmaildto.registrationToken;

  if (!tokenMatches) return false;

  user.isEmailVerified = true;
  user.registrationToken = null;
  await user.save();
  
  return true;
});

UserSchema.method('generateForgotPasswordDto', async function generateForgotPasswordDto(code:string):Promise<boolean>{
  const user = this;
  const token:string =  Math.floor(100000 + Math.random() * 900000).toString();
  user.passwordResetToken = await bcrypt.hash(code, 8);

  user.passwordResetToken = token;
  await user.save();

  return  true
});

UserSchema.method('tokenMatchesEmail', async function tokenMatchesEmail(token:string): Promise<boolean>{
  const user = this;
  return user.authTokens.find((authToken)=> token === authToken ) ? true : false;
});

(async()=>{

  const firstAdminUser: User = {
    password: "adminRobotanium1!",
    email: "gav@robotanium.com",
    userName: "robotanium",
    isRobotaniumAdmin: true,
    isPlayerAdmin: false,
    authTokens: [],
    isActive: true,
    isEmailVerified: true,
    registrationToken: null,
    passwordResetToken: null,
    changePassword: true,
    imgsrc: '',
    theme: 'dark',
    rememberme: false,
  }
  const user = mongoose.model('User', UserSchema);
  const firstAdminUserExists = await  user.findOne({email:firstAdminUser.email});

  if(!firstAdminUserExists){
    await new user(firstAdminUser).save();
  } 

})()