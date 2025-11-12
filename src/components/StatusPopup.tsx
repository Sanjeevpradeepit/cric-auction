import { useFirebase } from "@/contexts/FirebaseContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import React from "react";

type StatusPopupProps = {
  message: string;
  colorClass: string;
  imageURL?: string; // optional image URL
};

const StatusPopup: React.FC<StatusPopupProps> = ({ message, colorClass, imageURL }) => {
  const { addTeam, handleBidSubmit } = useFirebase();
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key="popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`bg-surface border ${colorClass} border-opacity-50 text-white px-10 py-8 rounded-2xl shadow-2xl text-center`}
          >
            {imageURL && (
              <div className="flex justify-center mb-4">
                <div className="relative w-24 h-24">
                  <Image
                    src={imageURL}
                    alt="Status illustration"
                    fill
                    className="object-cover rounded-full border-4 border-primary shadow-lg"
                  />
                </div>
              </div>
            )}
            <p className="text-3xl font-extrabold tracking-wide">{message}</p>
          </motion.div>
        </motion.div>
      )}
     <button
  onClick={handleBidSubmit}
  className="bg-primary text-white px-4 py-2 rounded font-bold hover:bg-secondary"
>
  Back
</button>
    </AnimatePresence>
  );
};

export default StatusPopup;
