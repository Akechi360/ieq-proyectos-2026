'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Type for the complete budget data structure
export type BudgetData = Prisma.BudgetCategoryGetPayload<{
    include: { items: true };
}>;

/**
 * Fetch all budget categories with their items from the database
 */
export async function getBudgetData(): Promise<BudgetData[]> {
    try {
        const categories = await prisma.budgetCategory.findMany({
            include: { items: true },
            orderBy: { order: 'asc' },
        });

        return categories;
    } catch (error) {
        console.error('Error fetching budget data:', error);
        throw new Error('Failed to fetch budget data');
    }
}

/**
 * Update the status of a budget item
 */
export async function updateItemStatus(
    itemId: string,
    newStatus: string
): Promise<{ success: boolean; error?: string }> {
    try {
        console.log(`[updateItemStatus] Updating item ${itemId} to ${newStatus}`);

        // Validate status
        const validStatuses = ['pending', 'in-progress', 'completed'];
        if (!validStatuses.includes(newStatus)) {
            console.error(`[updateItemStatus] Invalid status: ${newStatus}`);
            return { success: false, error: `Invalid status value: ${newStatus}` };
        }

        await prisma.budgetItem.update({
            where: { id: itemId },
            data: { status: newStatus },
        });

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error updating item status:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update status'
        };
    }
}

/**
 * Update a monthly cost for a budget item and recalculate total
 */
export async function updateItemCost(
    itemId: string,
    monthIndex: number,
    newCost: number
): Promise<{ success: boolean; error?: string }> {
    try {
        // Validate inputs
        if (monthIndex < 0 || monthIndex > 11) {
            return { success: false, error: 'Invalid month index' };
        }
        if (newCost < 0) {
            return { success: false, error: 'Cost cannot be negative' };
        }

        // Get current item
        const item = await prisma.budgetItem.findUnique({
            where: { id: itemId },
        });

        if (!item) {
            return { success: false, error: 'Item not found' };
        }

        // Update the monthly costs array
        const monthlyCosts = item.monthlyCosts.map((cost, index) =>
            index === monthIndex ? new Prisma.Decimal(newCost) : cost
        );

        // Calculate new total
        const total = monthlyCosts.reduce(
            (sum, cost) => sum.add(cost),
            new Prisma.Decimal(0)
        );

        // Update item with new costs and total
        await prisma.budgetItem.update({
            where: { id: itemId },
            data: {
                monthlyCosts,
                total,
            },
        });

        // Recalculate category totals
        await recalculateCategoryTotals(item.categoryId);

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error updating item cost:', error);
        return { success: false, error: 'Failed to update cost' };
    }
}

/**
 * Update the description of a budget item
 */
export async function updateItemDescription(
    itemId: string,
    description: string
): Promise<{ success: boolean; error?: string }> {
    try {
        if (!description.trim()) {
            return { success: false, error: 'Description cannot be empty' };
        }

        await prisma.budgetItem.update({
            where: { id: itemId },
            data: { description },
        });

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error updating item description:', error);
        return { success: false, error: 'Failed to update description' };
    }
}

/**
 * Update the title of a budget category
 */
export async function updateCategoryTitle(
    categoryId: string,
    title: string
): Promise<{ success: boolean; error?: string }> {
    try {
        if (!title.trim()) {
            return { success: false, error: 'Title cannot be empty' };
        }

        await prisma.budgetCategory.update({
            where: { id: categoryId },
            data: { title },
        });

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error updating category title:', error);
        return { success: false, error: 'Failed to update title' };
    }
}

/**
 * Add a new item to a category
 */
export async function addItemToCategory(
    categoryId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        // Create new item with empty monthly costs
        await prisma.budgetItem.create({
            data: {
                description: 'Nuevo Ítem',
                status: 'pending',
                monthlyCosts: Array(12).fill(new Prisma.Decimal(0)),
                total: new Prisma.Decimal(0),
                categoryId,
            },
        });

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error adding item:', error);
        return { success: false, error: 'Failed to add item' };
    }
}

/**
 * Delete a budget item
 */
export async function deleteItem(
    itemId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const item = await prisma.budgetItem.findUnique({
            where: { id: itemId },
        });

        if (!item) {
            return { success: false, error: 'Item not found' };
        }

        await prisma.budgetItem.delete({
            where: { id: itemId },
        });

        // Recalculate category totals
        await recalculateCategoryTotals(item.categoryId);

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error deleting item:', error);
        return { success: false, error: 'Failed to delete item' };
    }
}

/**
 * Helper function to recalculate category totals and percentages
 */
async function recalculateCategoryTotals(categoryId: string): Promise<void> {
    try {
        // Get all items for this category
        const items = await prisma.budgetItem.findMany({
            where: { categoryId },
        });

        // Calculate category total
        const categoryTotal = items.reduce(
            (sum, item) => sum.add(item.total),
            new Prisma.Decimal(0)
        );

        // Get grand total across all categories
        const allCategories = await prisma.budgetCategory.findMany({
            include: { items: true },
        });

        const grandTotal = allCategories.reduce((sum, cat) => {
            const catTotal = cat.items.reduce(
                (itemSum, item) => itemSum.add(item.total),
                new Prisma.Decimal(0)
            );
            return sum.add(catTotal);
        }, new Prisma.Decimal(0));

        // Calculate percentage
        const percentage = grandTotal.gt(0)
            ? categoryTotal.div(grandTotal).mul(100).toFixed(0) + '%'
            : '0%';

        // Update category
        await prisma.budgetCategory.update({
            where: { id: categoryId },
            data: {
                total: categoryTotal,
                percentage,
            },
        });
    } catch (error) {
        console.error('Error recalculating category totals:', error);
    }
}
