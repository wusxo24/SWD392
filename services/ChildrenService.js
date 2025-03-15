const Children = require("../models/Children");

class ChildrenService {
    async createChild(childData, memberId) {
        const { fname, lname, birthdate, gender, picture, blood_type, allergy, notes } = childData;
        const newChild = new Children({
            fname,
            lname,
            memberID: memberId,
            birthdate,
            gender,
            picture,
            blood_type,
            allergy,
            notes
        });
        await newChild.save();
        return newChild;
    }

    async getAllChildren() {
        return await Children.find();
    }

    async getChildByMemberId(memberId) {
        if (!memberId) {
            throw new Error("Member not found");
        }
        const children = await Children.find({ memberID: memberId });
        if (children.length === 0) {
            throw new Error("Member does not have any children");
        }
        return children;
    }

    async updateChild(id, updateData) {
        const updatedChild = await Children.findOneAndUpdate({ _id: id }, updateData, { new: true });
        if (!updatedChild) {
            throw new Error("Child không tồn tại!");
        }
        return updatedChild;
    }

    async deleteChild(id) {
        const deletedChild = await Children.findOneAndDelete({ _id: id });
        if (!deletedChild) {
            throw new Error("Child không tồn tại!");
        }
        return deletedChild;
    }

    async getChildById(id) {
        const child = await Children.findById(id);
        if (!child) {
            throw new Error("Child không tồn tại!");
        }
        return child;
    }
}

module.exports = new ChildrenService();