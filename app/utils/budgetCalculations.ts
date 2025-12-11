import { BudgetCategory, BudgetItem } from '../data';

/**
 * Calculate the total for a single budget item by summing all monthly costs
 */
export function calculateItemTotal(monthlyCosts: number[]): number {
    return monthlyCosts.reduce((sum, cost) => sum + cost, 0);
}

/**
 * Calculate the total for a category by summing all item totals
 */
export function calculateCategoryTotal(items: BudgetItem[]): number {
    return items.reduce((sum, item) => sum + item.total, 0);
}

/**
 * Calculate the percentage of a category relative to the grand total
 */
export function calculateCategoryPercentage(categoryTotal: number, grandTotal: number): string {
    if (grandTotal === 0) return '0%';
    const percentage = Math.round((categoryTotal / grandTotal) * 100);
    return `${percentage}%`;
}

/**
 * Calculate the grand total by summing all category totals
 */
export function calculateGrandTotal(categories: BudgetCategory[]): number {
    return categories.reduce((sum, category) => sum + category.total, 0);
}

/**
 * Calculate monthly totals across all categories
 * Returns an array of 12 numbers (one for each month)
 */
export function calculateMonthlyTotals(categories: BudgetCategory[]): number[] {
    const monthlyTotals = new Array(12).fill(0);

    categories.forEach(category => {
        category.items.forEach(item => {
            item.monthlyCosts.forEach((cost, monthIndex) => {
                monthlyTotals[monthIndex] += cost;
            });
        });
    });

    return monthlyTotals;
}

/**
 * Recalculate all totals and percentages for the budget data
 * This is a pure function that returns a new array with updated values
 */
export function recalculateBudgetData(categories: BudgetCategory[]): BudgetCategory[] {
    // First pass: calculate item totals
    const categoriesWithItemTotals = categories.map(category => ({
        ...category,
        items: category.items.map((item: BudgetItem) => ({
            ...item,
            total: calculateItemTotal(item.monthlyCosts)
        }))
    }));

    // Second pass: calculate category totals
    const categoriesWithTotals = categoriesWithItemTotals.map(category => ({
        ...category,
        total: calculateCategoryTotal(category.items)
    }));

    // Third pass: calculate percentages
    const grandTotal = calculateGrandTotal(categoriesWithTotals);
    const finalCategories = categoriesWithTotals.map(category => ({
        ...category,
        percentage: calculateCategoryPercentage(category.total, grandTotal)
    }));

    return finalCategories;
}

/**
 * Validate a cost input value
 * Returns the validated number or null if invalid
 */
export function validateCostInput(value: string): number | null {
    // Remove any whitespace
    const trimmed = value.trim();

    // Allow empty string (will be treated as 0)
    if (trimmed === '') return 0;

    // Parse as number
    const num = parseFloat(trimmed);

    // Check if it's a valid number
    if (isNaN(num)) return null;

    // Check if it's non-negative
    if (num < 0) return null;

    // Check if it's within reasonable bounds (max 999,999)
    if (num > 999999) return null;

    // Round to 2 decimal places
    return Math.round(num * 100) / 100;
}

/**
 * Format a number as currency with a fixed locale to prevent hydration errors
 */
export function formatCurrency(amount: number): string {
    return amount.toLocaleString('es-MX', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

/**
 * Generate a unique ID for items or categories
 */
export function generateUniqueId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Add a new empty item to a category
 */
export function addItemToCategory(category: BudgetCategory): BudgetCategory {
    const newItem: BudgetItem = {
        id: generateUniqueId(),
        description: '',
        status: 'pending',
        monthlyCosts: new Array(12).fill(0),
        total: 0
    };

    return {
        ...category,
        items: [...category.items, newItem]
    };
}

/**
 * Remove an item from a category by ID
 */
export function removeItemFromCategory(category: BudgetCategory, itemId: string): BudgetCategory {
    return {
        ...category,
        items: category.items.filter(item => item.id !== itemId)
    };
}

/**
 * Update an item's description
 */
export function updateItemDescription(item: BudgetItem, newDescription: string): BudgetItem {
    return {
        ...item,
        description: newDescription
    };
}

/**
 * Update a category's title
 */
export function updateCategoryTitle(category: BudgetCategory, newTitle: string): BudgetCategory {
    return {
        ...category,
        title: newTitle
    };
}
