export default function Cadastro() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          ExpenseFlow
        </h1>

        <h2 className="mt-2 text-center text-xl text-gray-600">
          Criar conta
        </h2>

        <form className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nome
            </label>

            <input
              id="name"
              type="text"
              placeholder="Digite seu nome"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-mail
            </label>

            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>

            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Criar conta
          </button>
        </form>
      </div>
    </main>
  );
}