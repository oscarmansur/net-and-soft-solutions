import { db } from "@/lib/db";
import { ToolItem } from "@/types/proposal";

export class ToolService {
  /**
   * Obtiene todas las definiciones de herramientas activas
   */
  static async listToolDefinitions(includeInactive = false) {
    return await db.toolDefinition.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: [{ isCustom: "asc" }, { displayOrder: "asc" }, { name: "asc" }],
    });
  }

  /**
   * Crea una herramienta personalizada persistida en la base de datos
   */
  static async createCustomTool(input: {
    name: string;
    category: string;
    description: string;
    supportLevel?: string;
    defaultIncluded?: boolean;
    defaultIncludedInHours?: boolean;
    requiresApproval?: boolean;
    separateQuote?: boolean;
    licenseIncluded?: boolean;
    notes?: string;
    displayOrder?: number;
  }) {
    return await db.toolDefinition.create({
      data: {
        name: input.name.trim(),
        category: input.category.trim(),
        description: input.description.trim(),
        supportLevel: input.supportLevel?.trim() || "Estándar",
        defaultIncluded: input.defaultIncluded ?? true,
        defaultIncludedInHours: input.defaultIncludedInHours ?? true,
        requiresApproval: input.requiresApproval ?? false,
        separateQuote: input.separateQuote ?? false,
        licenseIncluded: input.licenseIncluded ?? false,
        notes: input.notes?.trim() || null,
        displayOrder: input.displayOrder ?? 99,
        isCustom: true,
        isActive: true,
      },
    });
  }

  /**
   * Actualiza una herramienta existente
   */
  static async updateTool(
    id: string,
    input: Partial<{
      name: string;
      category: string;
      description: string;
      supportLevel: string;
      defaultIncluded: boolean;
      defaultIncludedInHours: boolean;
      requiresApproval: boolean;
      separateQuote: boolean;
      licenseIncluded: boolean;
      notes: string;
      displayOrder: number;
      isActive: boolean;
    }>
  ) {
    return await db.toolDefinition.update({
      where: { id },
      data: input,
    });
  }

  /**
   * Duplica una herramienta personalizada
   */
  static async duplicateTool(id: string) {
    const original = await db.toolDefinition.findUnique({ where: { id } });
    if (!original) throw new Error("Herramienta no encontrada");

    return await db.toolDefinition.create({
      data: {
        name: `${original.name} (Copia)`,
        category: original.category,
        description: original.description,
        supportLevel: original.supportLevel,
        defaultIncluded: original.defaultIncluded,
        defaultIncludedInHours: original.defaultIncludedInHours,
        requiresApproval: original.requiresApproval,
        separateQuote: original.separateQuote,
        licenseIncluded: original.licenseIncluded,
        notes: original.notes,
        displayOrder: original.displayOrder + 1,
        isCustom: true,
        isActive: true,
      },
    });
  }

  /**
   * Elimina una herramienta personalizada
   */
  static async deleteTool(id: string) {
    return await db.toolDefinition.delete({
      where: { id },
    });
  }
}
