import { useState } from "react";
import { X } from "lucide-react";
import { CATEGORIES, generateId, type Expense } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (expense: Expense) => void;
}

const AddExpenseModal = ({ open, onClose, onAdd }: AddExpenseModalProps) => {
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("food");

  const handleSubmit = () => {
    if (!amount || !name) return;
    onAdd({
      id: generateId(),
      amount: parseFloat(amount),
      name,
      category,
      date: new Date().toISOString(),
    });
    setAmount("");
    setName("");
    setCategory("food");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-background/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-card border-t border-card-border rounded-t-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-display">Add Expense</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <label className="block text-sm font-semibold mb-2">Amount</label>
            <div className="flex items-center bg-secondary border border-card-border rounded-xl px-4 py-3 mb-5">
              <span className="text-muted-foreground mr-3 text-lg">€</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-transparent flex-1 text-2xl font-bold text-foreground text-center outline-none placeholder:text-muted-foreground/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                autoFocus
              />
            </div>

            <label className="block text-sm font-semibold mb-2">What was it?</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Coffee, lunch, textbook..."
              className="w-full bg-secondary border border-card-border rounded-xl px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground/30 focus:border-primary transition-colors mb-5"
            />

            <label className="block text-sm font-semibold mb-3">Category</label>
            <div className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    category === cat.id
                      ? "gradient-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!amount || !name}
              className="w-full py-4 rounded-2xl gradient-primary text-primary-foreground font-bold text-lg disabled:opacity-30 active:scale-[0.97] transition-transform"
            >
              Add Expense
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddExpenseModal;
