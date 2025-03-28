import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "../utils/axiosInstance"; 
import { toast } from "react-hot-toast";

const DoctorResponseModal = ({ isOpen, onClose, requestId, onSuccess  }) => {
  const [diagnosis, setDiagnosis] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const diagnosisOptions = ["Common Cold", "Flu", "Hypertension", "Diabetes", "Allergy", "Infection", "Other"];
  const recommendationOptions = ["Prescribe Medication", "Further Tests Required", "Refer to Specialist", "Home Rest", "Follow-up Visit", "Other"];

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/doctor-responses/", {
        MedicalRequestId: requestId,
        Diagnosis: diagnosis,
        Recommendations: recommendation,
        AdditionalNotes: additionalNotes,
      });
      if (response.status === 200 || response.status === 201) {
        await axios.put(`/api/doctor-responses/${response.data._id}/complete`);
        onSuccess(); // ✅ Notify parent component
      }
      onClose();
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-lg bg-white shadow-xl rounded-lg p-6 border border-gray-200"
        aria-describedby="dialog-description"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">Doctor's Response</DialogTitle>
          <DialogDescription id="dialog-description" className="text-sm text-gray-600">
            Provide a diagnosis, recommendation, and any additional notes for this request.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Diagnosis Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Diagnosis</label>
            <Select onValueChange={setDiagnosis} value={diagnosis}>
              <SelectTrigger className="border border-gray-300 rounded-md px-3 py-2">
                <SelectValue placeholder="Select a diagnosis" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg border border-gray-300 rounded-md z-50">
                {diagnosisOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recommendation Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Recommendations</label>
            <Select onValueChange={setRecommendation} value={recommendation}>
              <SelectTrigger className="border border-gray-300 rounded-md px-3 py-2">
                <SelectValue placeholder="Select a recommendation" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg border border-gray-300 rounded-md z-50">
                {recommendationOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Additional Notes</label>
            <Textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Enter any additional details here..."
              className="w-full h-24 border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={onClose} className="px-5 py-2">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorResponseModal;
