function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("toast--visible");
  setTimeout(() => {
    toast.classList.remove("toast--visible");
  }, 3000);
}

function isMaiorDeIdade(dataISO, idadeMinima) {
  if (!dataISO) return false;
  const hoje = new Date();
  const dataNasc = new Date(dataISO);
  let idade = hoje.getFullYear() - dataNasc.getFullYear();
  const m = hoje.getMonth() - dataNasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
    idade--;
  }
  return idade >= idadeMinima;
}

document.addEventListener("DOMContentLoaded", () => {
  initSPA();
  initTemplates();
  initFormDoacao();
  initFormCadastro();
});

function initSPA() {
  const pages = document.querySelectorAll(".page");
  const routeLinks = document.querySelectorAll("[data-route]");
  const navToggle = document.querySelector(".nav__toggle");
  const navList = document.querySelector(".nav__list");

  if (!pages.length || !routeLinks.length) return;

  function showPage(route) {
    pages.forEach((page) => {
      const isActive = page.dataset.page === route;
      page.classList.toggle("page--active", isActive);
    });
  }

  routeLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const route = link.dataset.route;
      if (!route) return;
      e.preventDefault();
      showPage(route);
      window.location.hash = route;
      if (navList && navList.classList.contains("nav__list--open")) {
        navList.classList.remove("nav__list--open");
        if (navToggle) navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  const initialRoute = window.location.hash.replace("#", "") || "home";
  showPage(initialRoute);

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("nav__list--open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }
}

function initTemplates() {
  const projetosList = document.getElementById("projetos-list");
  if (projetosList) {
    const projetos = [
      {
        titulo: "Educação em foco",
        categoria: "Educação",
        impacto: "80 crianças atendidas por mês",
      },
      {
        titulo: "Cestas solidárias",
        categoria: "Assistência social",
        impacto: "150 famílias atendidas mensalmente",
      },
      {
        titulo: "Mutirões comunitários",
        categoria: "Comunidade",
        impacto: "10 espaços públicos revitalizados",
      },
    ];

    projetosList.innerHTML = projetos
      .map(
        (p) => `
        <article class="card">
          <div class="card__body">
            <h2>${p.titulo}</h2>
            <p>${p.impacto}</p>
            <span class="tag">${p.categoria}</span>
          </div>
        </article>
      `
      )
      .join("");
  }

  const voluntariadoList = document.getElementById("voluntariado-list");
  if (voluntariadoList) {
    const oportunidades = [
      {
        titulo: "Apoio escolar",
        carga: "4h semanais",
      },
      {
        titulo: "Distribuição de alimentos",
        carga: "1 sábado por mês",
      },
    ];

    voluntariadoList.innerHTML = oportunidades
      .map(
        (o) => `
        <article class="card">
          <div class="card__body">
            <h2>${o.titulo}</h2>
            <p>Carga horária: ${o.carga}</p>
          </div>
        </article>
      `
      )
      .join("");
  }

  const campanhasList = document.getElementById("campanhas-list");
  if (campanhasList) {
    const campanhas = [
      { nome: "Campanha de inverno", meta: 10000, atual: 6500 },
      { nome: "Natal solidário", meta: 8000, atual: 2000 },
    ];

    campanhasList.innerHTML = campanhas
      .map((c) => {
        const progresso = Math.round((c.atual / c.meta) * 100);
        return `
          <article class="card">
            <div class="card__body">
              <h3>${c.nome}</h3>
              <p>Meta: R$ ${c.meta.toLocaleString("pt-BR")}</p>
              <p>Arrecadado: R$ ${c.atual.toLocaleString(
                "pt-BR"
              )} (${progresso}%)</p>
            </div>
          </article>
        `;
      })
      .join("");
  }
}

function initFormDoacao() {
  const formDoacao = document.getElementById("form-doacao");
  const feedbackDoacao = document.getElementById("feedback-doacao");

  if (!formDoacao || !feedbackDoacao) return;

  formDoacao.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!formDoacao.checkValidity()) {
      feedbackDoacao.textContent =
        "Por favor, preencha todos os campos obrigatórios.";
      feedbackDoacao.style.color = "var(--color-danger)";
      formDoacao.reportValidity();
      showToast("Formulário de doação com campos inválidos.");
      return;
    }

    const valor = Number(formDoacao.valor.value || 0);
    feedbackDoacao.textContent = `Obrigado pela sua doação de R$ ${valor.toLocaleString(
      "pt-BR"
    )}! (simulado)`;
    feedbackDoacao.style.color = "var(--color-success)";
    showToast("Doação registrada com sucesso (simulado).");
    formDoacao.reset();
  });
}

function initFormCadastro() {
  const formCadastro = document.getElementById("form-cadastro");
  const feedbackCadastro = document.getElementById("feedback-cadastro");
  if (!formCadastro || !feedbackCadastro) return;

  const inputCPF = document.getElementById("cpf");
  const inputTelefone = document.getElementById("telefone");
  const inputCEP = document.getElementById("cep");
  const inputDataNascimento = document.getElementById("data-nascimento");

  if (inputCPF) {
    inputCPF.addEventListener("input", () => {
      let v = inputCPF.value.replace(/\D/g, "");
      if (v.length > 11) v = v.slice(0, 11);
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      inputCPF.value = v;
    });
  }

  if (inputTelefone) {
    inputTelefone.addEventListener("input", () => {
      let v = inputTelefone.value.replace(/\D/g, "");
      if (v.length > 11) v = v.slice(0, 11);
      v = v.replace(/(\d{2})(\d)/, "($1) $2");
      v = v.replace(/(\d{5})(\d{4})$/, "$1-$2");
      inputTelefone.value = v;
    });
  }

  if (inputCEP) {
    inputCEP.addEventListener("input", () => {
      let v = inputCEP.value.replace(/\D/g, "");
      if (v.length > 8) v = v.slice(0, 8);
      v = v.replace(/(\d{5})(\d{3})$/, "$1-$2");
      inputCEP.value = v;
    });
  }

  formCadastro.addEventListener("submit", (e) => {
    e.preventDefault();

    formCadastro
      .querySelectorAll("[aria-invalid='true']")
      .forEach((el) => el.setAttribute("aria-invalid", "false"));

    if (!formCadastro.checkValidity()) {
      feedbackCadastro.textContent =
        "Existem campos obrigatórios não preenchidos ou com formato inválido.";
      feedbackCadastro.style.color = "var(--color-danger)";

      const invalids = formCadastro.querySelectorAll(":invalid");
      invalids.forEach((el) => {
        el.setAttribute("aria-invalid", "true");
      });

      formCadastro.reportValidity();
      showToast("Verifique os campos destacados em vermelho.");
      return;
    }

    if (inputDataNascimento && !isMaiorDeIdade(inputDataNascimento.value, 16)) {
      feedbackCadastro.textContent =
        "Você precisa ter pelo menos 16 anos para se cadastrar.";
      feedbackCadastro.style.color = "var(--color-danger)";
      inputDataNascimento.setAttribute("aria-invalid", "true");
      showToast("Data de nascimento inconsistente (menor de 16 anos).");
      return;
    }

    feedbackCadastro.textContent =
      "Cadastro enviado com sucesso (simulado). Obrigado pelo seu interesse!";
    feedbackCadastro.style.color = "var(--color-success)";
    showToast("Cadastro registrado com sucesso.");

    formCadastro.reset();
  });
}
