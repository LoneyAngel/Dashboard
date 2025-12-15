import { SignupFormSchema, User } from "./definition"

export async function signup(state: User, formData: FormData) {
  // 验证表单字段
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })
 
  // 如果任何表单字段无效，提前返回
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
 
  // 调用提供商或数据库来创建用户...
}