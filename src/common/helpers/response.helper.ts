export const createApiResponse = (
  message: string,
  insertId: number | null = null,
) => {
  return {
    status: true,
    msg: message,
    result: {
      fieldCount: 0,
      affectedRows: 1,
      insertId: insertId ?? 0,
      serverStatus: 2,
      warningCount: 0,
      message: message,
      protocol41: true,
      changedRows: 0,
    },
  };
};
