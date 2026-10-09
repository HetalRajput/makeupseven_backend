const mongoose =require('mongoose');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contactNo: { type: Number, required: true, unique: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    document: { type: String, required: false },
    profileImage: { type: String, required: false },
    password: { type: String, required: false },
    role: { type: String, required: true, enum: ["user", "admin","partner"], default: "user"},
    status: { type: String, required: true, enum: ["active", "inactive"]},
    slot_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "slot"
    }]

});

// Default status: if role is "partner" and status not set, default to 'inactive'.
// Use pre-validate hook to set default based on role while allowing explicit overrides.
userSchema.pre('validate', function(next) {
    if (this.status === undefined || this.status === null) {
        if (this.role === 'partner') {
            this.status = 'inactive';
        } else {
            this.status = 'active';
        }
    }
    next();
});

 const users = mongoose.model('users', userSchema);

module.exports = users;