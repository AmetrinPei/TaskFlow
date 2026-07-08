export function successResponse(data: any, message?: string) {
  return { success: true, data, ...(message && { message }) };
}

export function listResponse(data: any[], total: number) {
  return { success: true, data, total };
}
