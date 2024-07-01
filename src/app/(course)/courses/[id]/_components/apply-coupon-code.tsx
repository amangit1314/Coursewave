import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RiCoupon3Line } from "react-icons/ri";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const ApplyCouponCode = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex justify-center items-center">
          <RiCoupon3Line />
          <p className="pl-2 hover:cursor-pointer text-xs text-gray-400 hover:text-blue-500  hover:underline">
            Apply Coupon
          </p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-gray-800 dark:text-white font-semibold">
            Enter coupon code below
          </DialogTitle>
          <DialogDescription>
            Enter coupon code below and press apply when you are done. It will
            applied to the course price.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="items-center">
            <Label className="text-left text-gray-800 dark:text-white font-semibold mb-1">
              Coupon Code
            </Label>
            <Input
              id="couponCode"
              value="Enter coupon code ..."
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
