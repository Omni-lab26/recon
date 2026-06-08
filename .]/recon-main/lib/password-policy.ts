// パスワードポリシー: 8文字以上・英字・数字・記号を含む

export type Rule = { label: string; test: (p: string) => boolean };

export const PASSWORD_RULES: Rule[] = [
  { label: "8文字以上", test: (p) => p.length >= 8 },
  { label: "英字を含む", test: (p) => /[a-zA-Z]/.test(p) },
  { label: "数字を含む", test: (p) => /[0-9]/.test(p) },
  { label: "記号(!@#$%など)を含む", test: (p) => /[!-/:-@[-`{-~]/.test(p) },
];

export function validatePassword(p: string): string | null {
  if (p.length < 8) return "パスワードは8文字以上で入力してください";
  if (!/[a-zA-Z]/.test(p)) return "パスワードに英字を含めてください";
  if (!/[0-9]/.test(p)) return "パスワードに数字を含めてください";
  if (!/[!-/:-@[-`{-~]/.test(p)) return "パスワードに記号(!@#$%など)を含めてください";
  return null;
}

// Supabaseからの英語エラーメッセージを日本語に
export function translateAuthError(msg: string): string {
  if (/invalid login credentials/i.test(msg)) return "メールアドレスかパスワードが違います";
  if (/email not confirmed/i.test(msg)) return "メール確認が完了していません。届いた確認メールのリンクを開いてください";
  if (/already registered|already exists/i.test(msg)) return "このメールアドレスは既に登録されています";
  if (/rate limit/i.test(msg)) return "リクエストが多すぎます。少し待ってから再試行してください";
  if (/password.*at least/i.test(msg)) return "パスワードがポリシーを満たしていません";
  return msg;
}
