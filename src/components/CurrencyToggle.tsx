import { useCurrency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";

const CurrencyToggle = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center bg-muted rounded-lg p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCurrency("KES")}
        className={`h-7 px-3 text-xs font-medium rounded-md transition-all ${
          currency === "KES"
            ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-transparent"
        }`}
      >
        KES
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCurrency("USD")}
        className={`h-7 px-3 text-xs font-medium rounded-md transition-all ${
          currency === "USD"
            ? "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary hover:text-secondary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-transparent"
        }`}
      >
        USD
      </Button>
    </div>
  );
};

export default CurrencyToggle;
