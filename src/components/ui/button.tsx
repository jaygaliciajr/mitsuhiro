import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/*
  Buttons are set in the label voice — narrow, tracked, uppercase — so an
  action reads as a sign rather than as UI chrome. Every size clears the 44px
  touch target from the brief.
*/
const buttonVariants = cva(
  "label inline-flex shrink-0 items-center justify-center gap-2 rounded-sm border border-transparent whitespace-nowrap transition-[background-color,color,border-color,box-shadow] outline-none select-none disabled:pointer-events-none disabled:opacity-55 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        /** The one loud thing on the page. Reserved for the primary CTA. */
        primary:
          "bg-brass text-ink hover:bg-brass-deep hover:text-paper active:translate-y-px",
        /** Sits beside primary on paper. */
        outline:
          "border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper active:translate-y-px",
        /** Sits beside primary inside a shade panel. */
        "outline-inverse":
          "on-shade border-ink-inverse/35 text-ink-inverse hover:border-brass-light hover:bg-brass-light hover:text-ink active:translate-y-px",
        ghost: "text-ink hover:bg-paper-sunk active:translate-y-px",
      },
      size: {
        default: "min-h-tap px-5 py-3",
        wide: "min-h-tap w-full px-5 py-3 sm:w-auto",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
