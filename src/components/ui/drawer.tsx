import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const drawerVariants = cva(
  "fixed inset-y-0 z-50 flex flex-col bg-background shadow-lg transition-transform duration-300 ease-in-out",
  {
    variants: {
      side: {
        right: "right-0 border-l",
        left: "left-0 border-r",
      },
      size: {
        sm: "w-3/4 sm:max-w-sm",
        default: "w-3/4 sm:max-w-md",
        lg: "w-3/4 sm:max-w-lg",
        xl: "w-3/4 sm:max-w-xl",
        full: "w-full",
      },
    },
    defaultVariants: {
      side: "right",
      size: "default",
    },
  }
);

export interface DrawerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerVariants> {
  open: boolean;
  onClose: () => void;
  hideCloseButton?: boolean;
}

const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      className,
      children,
      open,
      onClose,
      side,
      size,
      hideCloseButton = false,
      ...props
    },
    ref
  ) => {
    React.useEffect(() => {
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === "Escape" && open) {
          onClose();
        }
      };
      window.addEventListener("keydown", handleEsc);

      if (open) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }

      return () => {
        window.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = "";
      };
    }, [open, onClose]);

    if (!open) return null;

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Drawer */}
        <div
          ref={ref}
          className={cn(
            drawerVariants({ side, size }),
            side === "right"
              ? open
                ? "translate-x-0"
                : "translate-x-full"
              : open
              ? "translate-x-0"
              : "-translate-x-full",
            className
          )}
          {...props}
        >
          {!hideCloseButton && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
          )}
          {children}
        </div>
      </>
    );
  }
);
Drawer.displayName = "Drawer";

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-6 py-4 border-b", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-xl font-semibold", className)} {...props} />
);
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);
DrawerDescription.displayName = "DrawerDescription";

const DrawerBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1 overflow-auto p-6", className)} {...props} />
);
DrawerBody.displayName = "DrawerBody";

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col gap-2 p-6 border-t", className)}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

export {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
};
