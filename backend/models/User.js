import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'company', 'college', 'admin'],
      default: 'student',
    },
    // --- Company Specific Fields ---
    companyName: {
      type: String,
      required: function() { return this.role === 'company'; }
    },
    companyDescription: {
      type: String,
      required: function() { return this.role === 'company'; }
    },
    // --- FIX: Added companyLogo field ---
    companyLogo: {
        type: String,
    },
    verificationStatus: {
        type: String,
        enum: ['unverified', 'pending', 'approved', 'rejected'],
        default: 'unverified',
        required: function() { return this.role === 'company'; }
    },
    verificationDocument: {
        type: String,
        default: '',
        required: function() { return this.role === 'company' && this.isNew; }
    },
    // --- College Specific Fields ---
    collegeName: {
      type: String,
      required: function() { return this.role === 'college'; }
    },
    collegeLocation: {
      type: String,
      required: function() { return this.role === 'college'; }
    },
    // --- FIX: Added collegeLogo field ---
    collegeLogo: {
        type: String,
    },
    // --- Student Specific Fields ---
    studentId: {
      type: String,
      required: function() { return this.role === 'student'; },
      unique: true,
      sparse: true
    },
    major: {
        type: String,
        required: function() { return this.role === 'student'; }
    },
    resume: String,
    profilePicture: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('availabilityPeriods', {
  ref: 'Availability',
  localField: '_id',
  foreignField: 'college',
});


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
