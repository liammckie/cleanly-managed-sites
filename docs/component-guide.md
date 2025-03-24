
# Component Guide

This guide documents the key components in the application, their purpose, and how to use them.

## Layout Components

### AppLayout

The main layout component that wraps all pages.

```tsx
<AppLayout>
  <HomePage />
</AppLayout>
```

Props:
- `children`: React nodes to render within the layout

### Sidebar

Navigation sidebar for the application.

```tsx
<Sidebar>
  <SidebarSection title="Main">
    <SidebarItem icon={<HomeIcon />} href="/" label="Dashboard" />
    <SidebarItem icon={<UsersIcon />} href="/clients" label="Clients" />
    <SidebarItem icon={<MapPinIcon />} href="/sites" label="Sites" />
  </SidebarSection>
</Sidebar>
```

Props:
- `children`: Sidebar content
- `isCollapsed`: Boolean to control sidebar state
- `onToggle`: Function to handle collapse/expand

## Data Display Components

### DataTable

A flexible table component for displaying data with sorting, filtering, and pagination.

```tsx
<DataTable
  data={clients}
  columns={[
    { header: 'Name', accessorKey: 'name' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Status', accessorKey: 'status', cell: StatusCell },
    { header: 'Actions', cell: ActionsCell }
  ]}
  searchPlaceholder="Search clients..."
  onRowClick={handleRowClick}
/>
```

Props:
- `data`: Array of data objects
- `columns`: Column definitions
- `searchPlaceholder`: Text for search input
- `onRowClick`: Function for row click handler
- `pagination`: Boolean to enable pagination (default: true)
- `pageSize`: Number of rows per page (default: 10)

### StatusBadge

Badge for displaying status information.

```tsx
<StatusBadge status="active" />
<StatusBadge status="inactive" variant="outline" />
```

Props:
- `status`: Status value (active, inactive, pending, etc.)
- `variant`: Visual style (default, outline, etc.)
- `size`: Size (sm, md, lg)

### Card

Container for grouping related content.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Client Information</CardTitle>
    <CardDescription>Basic details about the client</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Edit</Button>
  </CardFooter>
</Card>
```

Components:
- `Card`: Main container
- `CardHeader`: Section for titles and descriptions
- `CardTitle`: Card title
- `CardDescription`: Subtitle or description
- `CardContent`: Main content area
- `CardFooter`: Actions section

### Tabs

Interface for switching between related content views.

```tsx
<Tabs defaultValue="details">
  <TabsList>
    <TabsTrigger value="details">Details</TabsTrigger>
    <TabsTrigger value="contacts">Contacts</TabsTrigger>
    <TabsTrigger value="sites">Sites</TabsTrigger>
  </TabsList>
  <TabsContent value="details">
    <ClientDetails client={client} />
  </TabsContent>
  <TabsContent value="contacts">
    <ClientContacts client={client} />
  </TabsContent>
  <TabsContent value="sites">
    <ClientSites client={client} />
  </TabsContent>
</Tabs>
```

Components:
- `Tabs`: Container component
- `TabsList`: Container for tab triggers
- `TabsTrigger`: Individual tab button
- `TabsContent`: Content for a specific tab

## Form Components

### Form

Form component with validation and error handling.

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormDescription>Enter the client's name</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

Components:
- `Form`: React Hook Form provider
- `FormField`: Field container with validation
- `FormItem`: Layout container for field elements
- `FormLabel`: Label for the field
- `FormControl`: Wrapper for the input element
- `FormDescription`: Help text for the field
- `FormMessage`: Error message container

### Input

Text input field.

```tsx
<Input 
  placeholder="Enter name" 
  value={name} 
  onChange={(e) => setName(e.target.value)} 
/>
```

Props:
- `placeholder`: Placeholder text
- `value`: Input value
- `onChange`: Change handler
- `disabled`: Disable the input
- `type`: Input type (text, email, password, etc.)

### Select

Dropdown selection field.

```tsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="inactive">Inactive</SelectItem>
    <SelectItem value="pending">Pending</SelectItem>
  </SelectContent>
</Select>
```

Components:
- `Select`: Container component
- `SelectTrigger`: Clickable element to open dropdown
- `SelectValue`: Displays selected value
- `SelectContent`: Dropdown content container
- `SelectItem`: Individual selectable option

### Checkbox

Checkbox input.

```tsx
<div className="flex items-center space-x-2">
  <Checkbox 
    id="isPrimary" 
    checked={isPrimary} 
    onCheckedChange={setIsPrimary} 
  />
  <label 
    htmlFor="isPrimary" 
    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    Primary Contact
  </label>
</div>
```

Props:
- `id`: Element ID
- `checked`: Checkbox state
- `onCheckedChange`: Change handler
- `disabled`: Disable the checkbox

### Button

Action button.

```tsx
<Button variant="default" size="default" onClick={handleClick}>
  Submit
</Button>

<Button variant="outline" size="sm">
  Cancel
</Button>

<Button variant="destructive">
  Delete
</Button>
```

Props:
- `variant`: Visual style (default, outline, destructive, ghost, link)
- `size`: Button size (default, sm, lg, icon)
- `onClick`: Click handler
- `disabled`: Disable the button
- `asChild`: Use the child component as the root element

## Dialog Components

### Dialog

Modal dialog for focused interactions.

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Edit Profile</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <ProfileForm />
    </div>
    <DialogFooter>
      <Button type="submit" form="profile-form">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

Components:
- `Dialog`: Container component
- `DialogTrigger`: Element that opens the dialog
- `DialogContent`: Dialog body
- `DialogHeader`: Section for title and description
- `DialogTitle`: Dialog title
- `DialogDescription`: Subtitle or description
- `DialogFooter`: Actions section

### AlertDialog

Confirmation dialog for destructive or important actions.

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete the client
        and all associated data.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

Components:
- `AlertDialog`: Container component
- `AlertDialogTrigger`: Element that opens the dialog
- `AlertDialogContent`: Dialog body
- `AlertDialogHeader`: Section for title and description
- `AlertDialogTitle`: Dialog title
- `AlertDialogDescription`: Explanation text
- `AlertDialogFooter`: Actions section
- `AlertDialogCancel`: Cancel button
- `AlertDialogAction`: Confirm button

## Feedback Components

### Toast

Notification component for temporary feedback.

```tsx
// In a component
const { toast } = useToast();

const handleClick = () => {
  toast({
    title: "Client saved",
    description: "The client details have been updated.",
  });
};

// For errors
toast({
  variant: "destructive",
  title: "Error",
  description: "Failed to save client details.",
});
```

Props:
- `title`: Toast title
- `description`: Detailed message
- `variant`: Visual style (default, destructive)
- `action`: Optional action button

### LoadingSpinner

Visual indicator for loading states.

```tsx
<LoadingSpinner size="default" />
<LoadingSpinner size="sm" />
```

Props:
- `size`: Spinner size (default, sm, lg)

### Empty State

Component for displaying when no data is available.

```tsx
<EmptyState
  title="No clients found"
  description="Try adjusting your search or filter to find what you're looking for."
  icon={<UsersIcon className="h-10 w-10" />}
  action={<Button>Add Client</Button>}
/>
```

Props:
- `title`: Main message
- `description`: Additional guidance
- `icon`: Visual element
- `action`: Optional action button

## Domain-Specific Components

### ClientCard

Card displaying client information.

```tsx
<ClientCard 
  client={client} 
  onClick={() => navigate(`/clients/${client.id}`)} 
/>
```

Props:
- `client`: Client data object
- `onClick`: Click handler

### SiteCard

Card displaying site information.

```tsx
<SiteCard 
  site={site} 
  onClick={() => navigate(`/sites/${site.id}`)} 
/>
```

Props:
- `site`: Site data object
- `onClick`: Click handler

### ContactCard

Card displaying contact information.

```tsx
<ContactCard contact={contact} onEdit={handleEdit} />
```

Props:
- `contact`: Contact data object
- `onEdit`: Edit handler

### ContractorCard

Card displaying contractor information.

```tsx
<ContractorCard contractor={contractor} onClick={handleClick} />
```

Props:
- `contractor`: Contractor data object
- `onClick`: Click handler

### QuoteBuilder

Component for building service quotes.

```tsx
<QuoteBuilder
  initialData={quote}
  onSave={handleSave}
  clients={clients}
  sites={sites}
/>
```

Props:
- `initialData`: Initial quote data (optional)
- `onSave`: Save handler
- `clients`: Available clients
- `sites`: Available sites

### ShiftPlanner

Component for planning work shifts.

```tsx
<ShiftPlanner
  shifts={shifts}
  onShiftsChange={setShifts}
  employmentType="full_time"
  level={2}
/>
```

Props:
- `shifts`: Array of shift objects
- `onShiftsChange`: Change handler
- `employmentType`: Employment type for rate calculations
- `level`: Employee level for rate calculations

### AwardRatesTable

Table displaying award rates.

```tsx
<AwardRatesTable
  employmentType="full_time"
  level={2}
/>
```

Props:
- `employmentType`: Employment type (full_time, part_time, casual)
- `level`: Employee level (1, 2, 3)

### JobCostCalculator

Calculator for job costing.

```tsx
<JobCostCalculator
  shifts={shifts}
  overheadPercentage={15}
  marginPercentage={20}
  onCostUpdate={handleCostUpdate}
/>
```

Props:
- `shifts`: Array of shift objects
- `overheadPercentage`: Overhead percentage
- `marginPercentage`: Margin percentage
- `onCostUpdate`: Function called when costs are calculated

## Best Practices

### Component Organization

Components should be organized in a logical structure:

```
/components
  /ui         # Generic UI components
  /layout     # Layout components
  /forms      # Form components
  /clients    # Client-specific components
  /sites      # Site-specific components
  /quotes     # Quote-specific components
  /contractors # Contractor-specific components
```

### Component Design

1. **Single Responsibility**: Each component should have a single responsibility.
2. **Props Interface**: Define a clear props interface for each component.
3. **Default Props**: Provide sensible defaults for optional props.
4. **Component Documentation**: Add JSDoc comments for component documentation.
5. **Composition**: Prefer composition over inheritance.

### Accessibility

1. **Semantic HTML**: Use appropriate HTML elements.
2. **ARIA Attributes**: Add ARIA attributes where needed.
3. **Keyboard Navigation**: Ensure keyboard navigability.
4. **Color Contrast**: Maintain sufficient color contrast.
5. **Focus Management**: Handle focus properly in interactive components.
