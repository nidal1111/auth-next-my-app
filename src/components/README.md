# UI Components Documentation

This directory contains reusable UI components built with React, TypeScript, and Tailwind CSS. Components follow a composition pattern and use Radix UI primitives for accessibility.

## Architecture Overview

Components are designed with these principles:
- **Composability**: Small, focused components that combine well
- **Accessibility**: Built on Radix UI for WCAG compliance
- **Type Safety**: Full TypeScript support with proper typing
- **Styling Flexibility**: Tailwind classes with CVA for variants
- **Performance**: Optimized with React.forwardRef for ref forwarding

## Component Library

### 🔘 `Button`

A versatile button component with multiple variants and sizes.

**Usage**:
```tsx
import { Button } from "@/components/ui/button"

// Default variant
<Button>Click me</Button>

// Different variants
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="secondary">Save as draft</Button>
<Button variant="ghost">Learn more</Button>
<Button variant="link">View details</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>

// Disabled state
<Button disabled>Processing...</Button>

// As child (renders child element)
<Button asChild>
  <a href="/home">Home</a>
</Button>
```

**Props**:
- `variant`: default | destructive | outline | secondary | ghost | link
- `size`: default | sm | lg | icon
- `asChild`: boolean (uses Radix Slot for composition)
- All standard button HTML attributes

**Design Decisions**:
- **CVA for variants**: Clean variant management with IntelliSense
- **Radix Slot**: Allows rendering as different elements
- **Focus styles**: Visible focus ring for accessibility

---

### 📝 `Input`

A styled input component for forms.

**Usage**:
```tsx
import { Input } from "@/components/ui/input"

// Basic input
<Input type="email" placeholder="Enter email" />

// With error styling
<Input className="border-red-500" />

// Different types
<Input type="text" />
<Input type="email" />
<Input type="password" />
<Input type="number" />

// Disabled state
<Input disabled />
```

**Props**:
- All standard input HTML attributes
- Custom className merging with cn()

**Styling**:
- Consistent height and padding
- Focus ring for accessibility
- Disabled state styling
- Error state through className

---

### 🏷️ `Label`

An accessible label component built on Radix UI Label.

**Usage**:
```tsx
import { Label } from "@/components/ui/label"

// Basic label
<Label htmlFor="email">Email address</Label>

// With nested input
<Label>
  Email
  <Input type="email" />
</Label>

// With error styling
<Label className="text-red-500">Required field</Label>
```

**Props**:
- All standard label HTML attributes
- Variants from CVA (if needed in future)

**Accessibility**:
- Proper label-input association
- Click on label focuses input
- Screen reader friendly

---

### 🔒 `PasswordInput`

A custom password input with visibility toggle.

**Usage**:
```tsx
import { PasswordInput } from "@/components/ui/password-input"

// Basic usage
<PasswordInput 
  placeholder="Enter password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

// With form validation
<PasswordInput 
  required
  minLength={6}
  className={errors.password ? "border-red-500" : ""}
/>
```

**Features**:
- Toggle password visibility
- Eye/EyeOff icons from Lucide
- Maintains all input functionality
- Proper type switching

**Implementation**:
```tsx
// Internal state for visibility
const [showPassword, setShowPassword] = useState(false)

// Toggle button inside input
<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-3 top-1/2 -translate-y-1/2"
>
```

## Styling System

### Tailwind Configuration

Components use these custom Tailwind extensions:

```js
// Colors
primary, secondary, destructive, muted, accent, popover, card

// Border radius
radius: 0.5rem (customizable via CSS variables)

// Animations
accordion-down, accordion-up
```

### CSS Variables

Components support theming through CSS variables:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... more variables */
}
```

### Utility Function

The `cn()` utility merges classes intelligently:

```tsx
import { cn } from "@/lib/utils"

// Merges classes and handles conflicts
cn("px-4 py-2", "px-6") // Result: "py-2 px-6"
cn("text-red-500", conditional && "text-blue-500")
```

## Best Practices

### 1. Component Composition

```tsx
// ✅ Good: Composable components
<form>
  <div>
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" />
  </div>
  <Button type="submit">Submit</Button>
</form>

// ❌ Bad: Overly complex single component
<SuperForm fields={...} />
```

### 2. Accessibility

```tsx
// ✅ Always associate labels with inputs
<Label htmlFor="username">Username</Label>
<Input id="username" />

// ✅ Provide proper ARIA attributes
<Button aria-label="Close dialog">×</Button>

// ✅ Handle keyboard navigation
<Input onKeyDown={handleKeyDown} />
```

### 3. Type Safety

```tsx
// ✅ Use proper TypeScript types
interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

// ✅ Forward refs properly
const Input = React.forwardRef<HTMLInputElement, Props>(...)
```

### 4. Performance

```tsx
// ✅ Use React.memo for expensive components
export const ExpensiveComponent = React.memo(Component)

// ✅ Avoid inline functions in props
const handleClick = useCallback(() => {}, [deps])
```

## Adding New Components

When creating new components:

1. **Start with Radix UI**: Check if a primitive exists
2. **Define variants**: Use CVA for multiple styles
3. **Ensure accessibility**: Test with keyboard and screen readers
4. **Add TypeScript types**: Extend HTML element interfaces
5. **Document usage**: Add examples and prop descriptions
6. **Test thoroughly**: Different states and edge cases

Example template:

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const componentVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-classes",
        secondary: "secondary-classes",
      },
      size: {
        default: "default-size",
        sm: "small-size",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {}

const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(componentVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Component.displayName = "Component"

export { Component }
```

## Future Enhancements

Potential components to add:

- **Toast**: Notifications system
- **Modal/Dialog**: Accessible modals
- **Dropdown**: Menu and select components
- **Tooltip**: Hover information
- **Tabs**: Tabbed interfaces
- **Card**: Content containers
- **Avatar**: User profile images
- **Badge**: Status indicators