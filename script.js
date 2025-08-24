        let currentStep = 1;
        const totalSteps = 8;
        const formData = {};

        // Melhorias de performance e responsividade
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM carregado - iniciando formulário');
            console.log('currentStep:', currentStep, 'totalSteps:', totalSteps);
            
            // Garantir que estamos na primeira etapa
            currentStep = 1;
            
            showQuestion(1); // Garantir que a primeira pergunta seja exibida
            console.log('Primeira pergunta exibida');
            
            updateProgress();
            console.log('Progresso atualizado');
            
            updateNavigation();
            console.log('Navegação atualizada');
            
            updateStepCounter();
            console.log('Contador de etapas atualizado');
            
            // Adicionar event listeners para checkboxes das prioridades (máximo 3)
            const prioCheckboxes = document.querySelectorAll('input[name="prioridades"]');
            console.log('Checkboxes de prioridades encontrados:', prioCheckboxes.length);
            
            prioCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    const checkedPrios = document.querySelectorAll('input[name="prioridades"]:checked');
                    console.log('Prioridade alterada - total selecionadas:', checkedPrios.length);
                    
                    if (checkedPrios.length > 3) {
                        this.checked = false;
                        console.log('Bloqueando seleção - máximo 3 prioridades');
                        showToast('Selecione no máximo 3 prioridades!');
                    }
                });
            });
            
            // Otimizações para touch em dispositivos móveis
            const labels = document.querySelectorAll('.option label');
            labels.forEach(label => {
                label.addEventListener('touchstart', function() {
                    this.style.transform = 'translateY(-1px)';
                }, { passive: true });
                
                label.addEventListener('touchend', function() {
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                }, { passive: true });
            });
            
            // Ajustar altura do viewport em dispositivos móveis
            const setViewportHeight = () => {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            };
            
            setViewportHeight();
            window.addEventListener('resize', setViewportHeight);
            window.addEventListener('orientationchange', () => {
                setTimeout(setViewportHeight, 100);
            });
            
            // Otimização para scroll em dispositivos touch
            let isScrolling = false;
            window.addEventListener('scroll', function() {
                if (!isScrolling) {
                    window.requestAnimationFrame(function() {
                        // Qualquer lógica de scroll aqui
                        isScrolling = false;
                    });
                    isScrolling = true;
                }
            }, { passive: true });
        });

        function updateProgress() {
            const progress = (currentStep / totalSteps) * 100;
            const progressBar = document.getElementById('progressBar');
            
            if (progressBar) {
                progressBar.style.width = progress + '%';
                console.log('Progresso atualizado:', progress + '%');
            } else {
                console.error('Barra de progresso não encontrada!');
            }
        }

        function updateStepCounter() {
            const stepCounter = document.getElementById('stepCounter');
            
            if (stepCounter) {
                stepCounter.textContent = `Etapa ${currentStep} de ${totalSteps}`;
                console.log('Contador de etapas atualizado:', `Etapa ${currentStep} de ${totalSteps}`);
            } else {
                console.error('Contador de etapas não encontrado!');
            }
        }

        function updateNavigation() {
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const submitBtn = document.getElementById('submitBtn');

            console.log('updateNavigation chamada - currentStep:', currentStep, 'totalSteps:', totalSteps);
            
            // Verificar se os botões foram encontrados
            if (!prevBtn || !nextBtn || !submitBtn) {
                console.error('Botões não encontrados!');
                return;
            }

            // Botão Anterior - sempre visível exceto na primeira etapa
            prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
            
            // Botão Próximo e Finalizar - lógica baseada na etapa atual
            if (currentStep === totalSteps) {
                // Última etapa (8): esconder Próximo, mostrar Finalizar
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'block';
                console.log('Última etapa - mostrando botão Finalizar');
            } else {
                // Etapas 1-7: mostrar Próximo, esconder Finalizar
                nextBtn.style.display = 'block';
                submitBtn.style.display = 'none';
                console.log('Não é última etapa - mostrando botão Próximo');
            }
            
            // Verificar estado final dos botões
            console.log('Estado final dos botões:');
            console.log('- Anterior:', prevBtn.style.display);
            console.log('- Próximo:', nextBtn.style.display);
            console.log('- Finalizar:', submitBtn.style.display);
        }

        function showQuestion(step) {
            console.log('showQuestion chamada - Etapa:', step);
            
            // Esconder todas as perguntas
            document.querySelectorAll('.question').forEach(q => {
                q.classList.remove('active');
            });
            console.log('Todas as perguntas ocultadas');
            
            // Mostrar pergunta atual
            const currentQuestion = document.querySelector(`[data-step="${step}"]`);
            if (currentQuestion) {
                currentQuestion.classList.add('active');
                console.log('Pergunta da etapa', step, 'exibida');
            } else {
                console.error('Pergunta da etapa', step, 'não encontrada!');
            }
        }

        function nextStep() {
            console.log('nextStep chamada - Etapa atual:', currentStep);
            
            if (validateCurrentStep()) {
                console.log('Validação aprovada - coletando dados');
                collectCurrentStepData();
                
                if (currentStep < totalSteps) {
                    currentStep++;
                    console.log('Indo para próxima etapa:', currentStep);
                    
                    showQuestion(currentStep);
                    updateProgress();
                    updateNavigation();
                    updateStepCounter();
                    
                    // Scroll para o topo
                    document.querySelector('.container').scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                } else {
                    console.log('Já na última etapa - forçando atualização da navegação');
                    // Forçar atualização da navegação mesmo na última etapa
                    updateNavigation();
                }
            } else {
                console.log('Validação falhou - não avançando');
            }
        }

        function previousStep() {
            console.log('previousStep chamada - Etapa atual:', currentStep);
            
            if (currentStep > 1) {
                currentStep--;
                console.log('Indo para etapa anterior:', currentStep);
                
                showQuestion(currentStep);
                updateProgress();
                updateNavigation();
                updateStepCounter();
                
                // Scroll para o topo
                document.querySelector('.container').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            } else {
                console.log('Já na primeira etapa');
            }
        }

        function validateCurrentStep() {
            const currentQuestion = document.querySelector(`[data-step="${currentStep}"]`);
            const checkedInputs = currentQuestion.querySelectorAll('input:checked');
            const observationField = currentQuestion.querySelector('.observation-field textarea');
            
            console.log('validateCurrentStep - Etapa:', currentStep, 'Opções selecionadas:', checkedInputs.length);
            
            // Se não há opções selecionadas, verificar se há observação preenchida
            if (checkedInputs.length === 0) {
                // Se há campo de observação e está preenchido, permitir continuar
                if (observationField && observationField.value.trim()) {
                    console.log('Permitindo continuar com observação preenchida');
                    return true;
                }
                
                // Na última etapa, permitir continuar mesmo sem seleção
                if (currentStep === totalSteps) {
                    console.log('Última etapa - permitindo continuar sem validação');
                    return true;
                }
                
                console.log('Nenhuma opção selecionada e sem observação - bloqueando');
                showToast('Por favor, selecione pelo menos uma opção ou adicione uma observação para continuar!');
                return false;
            }
            
            console.log('Validação aprovada');
            return true;
        }

        function collectCurrentStepData() {
            console.log('collectCurrentStepData chamada - Etapa:', currentStep);
            
            const currentQuestion = document.querySelector(`[data-step="${currentStep}"]`);
            const checkedInputs = currentQuestion.querySelectorAll('input:checked');
            
            console.log('Opções selecionadas:', checkedInputs.length);
            
            checkedInputs.forEach(input => {
                const name = input.name;
                const value = input.value;
                
                if (!formData[name]) {
                    formData[name] = [];
                }
                
                if (!formData[name].includes(value)) {
                    formData[name].push(value);
                }
            });
            
            // Coletar campo de observação se existir
            const observationField = currentQuestion.querySelector('.observation-field textarea');
            if (observationField && observationField.value.trim()) {
                const observationName = observationField.name;
                formData[observationName] = observationField.value.trim();
                console.log('Observação coletada:', observationName, formData[observationName]);
            }
            
            console.log('Dados da etapa coletados:', formData);
        }

        function submitForm() {
            console.log('submitForm chamada - Etapa atual:', currentStep);
            
            if (validateCurrentStep()) {
                console.log('Validação aprovada - coletando dados finais');
                collectCurrentStepData();
                
                // Gerar mensagem organizada para WhatsApp
                const mensagem = gerarMensagemWhatsApp(formData);
                console.log('Mensagem WhatsApp gerada');
                
                // Configurar link do WhatsApp
                const numeroWhatsApp = '5585991993833';
                const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
                document.getElementById('whatsappBtn').href = linkWhatsApp;
                
                // Esconder formulário e elementos relacionados
                document.getElementById('diagnosticForm').style.display = 'none';
                document.querySelector('.header').style.display = 'none';
                document.querySelector('.progress-container').style.display = 'none';
                document.querySelector('.step-counter').style.display = 'none';
                document.querySelector('.navigation').style.display = 'none';
                
                // Aplicar classe especial ao container para centralização perfeita
                const container = document.querySelector('.container');
                container.classList.add('thank-you-container');
                
                // Mostrar tela de agradecimento com animação
                const thankYouElement = document.getElementById('thankYou');
                thankYouElement.classList.add('active');
                
                // Ajustar posicionamento para diferentes tamanhos de tela
                adjustThankYouPosition();
                
                // Scroll suave para o topo da tela de agradecimento
                setTimeout(() => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 100);
                
                console.log('Formulário enviado - mostrando agradecimento');
                
                // Log dos dados para debug
                console.log('Dados coletados:', formData);
                console.log('Mensagem WhatsApp:', mensagem);
                
                // Adicionar listener para redimensionamento da janela
                window.addEventListener('resize', adjustThankYouPosition);
            } else {
                console.log('Validação falhou - não enviando formulário');
            }
        }

        // Função para ajustar posicionamento da tela de agradecimento
        function adjustThankYouPosition() {
            const thankYouElement = document.getElementById('thankYou');
            const container = document.querySelector('.container');
            const body = document.body;
            
            if (!thankYouElement || !container) return;
            
            // Aplicar classe ao body para centralização perfeita
            body.classList.add('thank-you-mode');
            
            // Obter dimensões da viewport
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            
            // Ajustar altura mínima baseada no tamanho da tela
            if (viewportWidth <= 576) {
                // Mobile portrait
                thankYouElement.style.minHeight = '70vh';
                container.style.minHeight = '100vh';
            } else if (viewportWidth <= 768) {
                // Mobile landscape / tablet pequeno
                thankYouElement.style.minHeight = '65vh';
                container.style.minHeight = '100vh';
            } else if (viewportWidth <= 992) {
                // Tablet
                thankYouElement.style.minHeight = '60vh';
                container.style.minHeight = '90vh';
            } else if (viewportWidth <= 1200) {
                // Desktop pequeno
                thankYouElement.style.minHeight = '55vh';
                container.style.minHeight = '85vh';
            } else {
                // Desktop grande
                thankYouElement.style.minHeight = '50vh';
                container.style.minHeight = '80vh';
            }
            
            // Ajustar padding baseado no tamanho da tela
            if (viewportWidth <= 360) {
                thankYouElement.style.padding = '15px 10px';
            } else if (viewportWidth <= 576) {
                thankYouElement.style.padding = '20px 15px';
            } else if (viewportWidth <= 768) {
                thankYouElement.style.padding = '30px 20px';
            } else if (viewportWidth <= 992) {
                thankYouElement.style.padding = '35px 25px';
            } else if (viewportWidth <= 1200) {
                thankYouElement.style.padding = '40px 30px';
            } else {
                thankYouElement.style.padding = '45px 35px';
            }
            
            // Centralizar verticalmente se necessário
            const containerHeight = container.offsetHeight;
            const thankYouHeight = thankYouElement.offsetHeight;
            
            if (containerHeight > viewportHeight) {
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                container.style.justifyContent = 'center';
            }
            
            // Ajustar posicionamento baseado na altura da viewport
            if (viewportHeight <= 600) {
                // Dispositivos com altura limitada
                thankYouElement.style.minHeight = '80vh';
                container.style.minHeight = '100vh';
            }
            
            console.log('Posicionamento da tela de agradecimento ajustado');
            console.log('Viewport:', viewportWidth + 'x' + viewportHeight);
            console.log('Container:', container.offsetWidth + 'x' + containerHeight);
            console.log('Thank You:', thankYouElement.offsetWidth + 'x' + thankYouHeight);
            console.log('Body class aplicada:', body.classList.contains('thank-you-mode'));
        }

        function gerarMensagemWhatsApp(dados) {
            console.log('gerarMensagemWhatsApp chamada com dados:', dados);
            
            let mensagem = `🫐 *DIAGNÓSTICO LUME AÇAÍ - JOÃO XXIII*\n`;
            mensagem += `🚀 *Sistema Personalizado - Análise Completa*\n\n`;
            
            // 1. Canais de Venda
            if (dados.canais_venda && dados.canais_venda.length > 0) {
                mensagem += `📱 *CANAIS DE VENDA ATUAIS:*\n`;
                dados.canais_venda.forEach(canal => {
                    const nomeCanal = {
                        'balcao': '🏪 Balcão/Presencial',
                        'whatsapp': '💬 WhatsApp',
                        'ifood': '🍴 iFood',
                        'instagram': '📸 Instagram',
                        'telefone': '☎️ Telefone',
                        'outros': '➕ Outros'
                    };
                    mensagem += `• ${nomeCanal[canal] || canal}\n`;
                });
                mensagem += `\n`;
            }
            
            // Observação dos Canais de Venda
            if (dados.observacao_canais) {
                mensagem += `💡 *OBSERVAÇÃO - CANAIS DE VENDA:*\n`;
                mensagem += `${dados.observacao_canais}\n\n`;
            }

            // 2. Organização WhatsApp
            if (dados.organizacao_whatsapp && dados.organizacao_whatsapp.length > 0) {
                mensagem += `📝 *ORGANIZAÇÃO WHATSAPP ATUAL:*\n`;
                const organizacao = {
                    'caderno': '📖 Caderno/Anotações',
                    'planilha': '📊 Planilha',
                    'cabeca': '🧠 De cabeça/memória',
                    'sistema': '💻 Sistema/App',
                    'outro': '❓ Outro método'
                };
                mensagem += `• ${organizacao[dados.organizacao_whatsapp[0]] || dados.organizacao_whatsapp[0]}\n\n`;
            }
            
            // Observação da Organização WhatsApp
            if (dados.observacao_whatsapp) {
                mensagem += `💡 *OBSERVAÇÃO - ORGANIZAÇÃO WHATSAPP:*\n`;
                mensagem += `${dados.observacao_whatsapp}\n\n`;
            }

            // 3. Desafios na Cozinha
            if (dados.desafios_cozinha && dados.desafios_cozinha.length > 0) {
                mensagem += `👩‍🍳 *PRINCIPAIS DESAFIOS NA COZINHA:*\n`;
                dados.desafios_cozinha.forEach(desafio => {
                    const nomeDesafio = {
                        'esquecer_itens': '❗ Esquecer itens do pedido',
                        'demora_fila': '⏰ Demora na fila de pedidos',
                        'falta_organizacao': '🔄 Falta de organização na ordem',
                        'comunicacao': '💬 Comunicação entre equipe',
                        'falta_ingredientes': '🛒 Falta de ingredientes',
                        'tempo_preparo': '⏱️ Controle do tempo de preparo'
                    };
                    mensagem += `• ${nomeDesafio[desafio] || desafio}\n`;
                });
                mensagem += `\n`;
            }
            
            // Observação dos Desafios na Cozinha
            if (dados.observacao_cozinha) {
                mensagem += `💡 *OBSERVAÇÃO - DESAFIOS NA COZINHA:*\n`;
                mensagem += `${dados.observacao_cozinha}\n\n`;
            }

            // 4. Tipo de Delivery
            if (dados.tipo_delivery && dados.tipo_delivery.length > 0) {
                mensagem += `🛵 *LOGÍSTICA DE ENTREGAS:*\n`;
                dados.tipo_delivery.forEach(tipo => {
                    const tipoDelivery = {
                        'motoboy_proprio': '👤 1 motoboy próprio fixo',
                        'multiplos_motoboys': '👥 Vários motoboys próprios',
                        'terceiros': '🤝 Terceirizados quando preciso',
                        'ifood_entrega': '🍴 Só iFood Entrega',
                        'nao_faco': '❌ Não faço entrega própria'
                    };
                    mensagem += `• ${tipoDelivery[tipo] || tipo}\n`;
                });
                mensagem += `\n`;
            }
            
            // Observação do Delivery
            if (dados.observacao_delivery) {
                mensagem += `💡 *OBSERVAÇÃO - LOGÍSTICA DE ENTREGAS:*\n`;
                mensagem += `${dados.observacao_delivery}\n\n`;
            }

            // 5. Relatórios Desejados
            if (dados.relatorios_desejados && dados.relatorios_desejados.length > 0) {
                mensagem += `📊 *RELATÓRIOS E CONTROLES DESEJADOS:*\n`;
                dados.relatorios_desejados.forEach(relatorio => {
                    const nomeRelatorio = {
                        'vendas_diarias': '📈 Vendas diárias/semanais/mensais',
                        'produtos_vendidos': '⭐ Produtos mais vendidos',
                        'ticket_medio': '💰 Ticket médio por cliente',
                        'controle_estoque': '📦 Controle de estoque/ingredientes',
                        'desperdicio': '🗑️ Controle de desperdício',
                        'tempo_entrega': '🚀 Tempo médio de entrega',
                        'fluxo_caixa': '💳 Fluxo de caixa detalhado'
                    };
                    mensagem += `• ${nomeRelatorio[relatorio] || relatorio}\n`;
                });
                mensagem += `\n`;
            }
            
            // Observação dos Relatórios
            if (dados.observacao_relatorios) {
                mensagem += `💡 *OBSERVAÇÃO - RELATÓRIOS E CONTROLES:*\n`;
                mensagem += `${dados.observacao_relatorios}\n\n`;
            }

            // 6. Integrações
            if (dados.integracoes && dados.integracoes.length > 0) {
                mensagem += `🔗 *INTEGRAÇÕES IMPORTANTES:*\n`;
                dados.integracoes.forEach(integracao => {
                    const nomeIntegracao = {
                        'whatsapp_automatico': '💬 WhatsApp automático (pedidos e status)',
                        'ifood_automatico': '🍴 iFood automático',
                        'pagamentos': '💳 Pagamentos (Pix, cartão, etc)',
                        'nota_fiscal': '🧾 Emissão de nota fiscal',
                        'impressora': '🖨️ Impressora térmica',
                        'google_maps': '🗺️ Google Maps (rota de entrega)'
                    };
                    mensagem += `• ${nomeIntegracao[integracao] || integracao}\n`;
                });
                mensagem += `\n`;
            }
            
            // Observação das Integrações
            if (dados.observacao_integracoes) {
                mensagem += `💡 *OBSERVAÇÃO - INTEGRAÇÕES:*\n`;
                mensagem += `${dados.observacao_integracoes}\n\n`;
            }

            // 7. Funcionalidades Especiais
            if (dados.funcionalidades && dados.funcionalidades.length > 0) {
                mensagem += `⭐ *FUNCIONALIDADES ESPECIAIS:*\n`;
                dados.funcionalidades.forEach(func => {
                    const nomeFuncionalidade = {
                        'programa_fidelidade': '❤️ Programa de fidelidade',
                        'promocoes_automaticas': '🎯 Promoções automáticas',
                        'cardapio_digital': '📱 Cardápio digital (QR Code)',
                        'pedidos_agendados': '📅 Pedidos agendados',
                        'avaliacao_cliente': '⭐ Avaliação dos clientes',
                        'app_entregador': '📱 App para o entregador',
                        'painel_cozinha_tv': '📺 Painel da cozinha na TV'
                    };
                    mensagem += `• ${nomeFuncionalidade[func] || func}\n`;
                });
                mensagem += `\n`;
            }
            
            // Observação das Funcionalidades
            if (dados.observacao_funcionalidades) {
                mensagem += `💡 *OBSERVAÇÃO - FUNCIONALIDADES ESPECIAIS:*\n`;
                mensagem += `${dados.observacao_funcionalidades}\n\n`;
            }

            // 8. Prioridades (TOP 3)
            if (dados.prioridades && dados.prioridades.length > 0) {
                mensagem += `🎯 *TOP ${dados.prioridades.length} PRIORIDADES URGENTES:*\n`;
                dados.prioridades.forEach((prioridade, index) => {
                    const nomePrioridade = {
                        'organizacao_pedidos': '📋 Organização dos pedidos (WhatsApp, balcão, iFood)',
                        'agilidade_cozinha': '🔥 Agilidade e organização na cozinha',
                        'controle_entregas': '🚀 Controle e rastreamento das entregas',
                        'relatorios_vendas': '📊 Relatórios de vendas e resultados',
                        'controle_estoque': '🏪 Controle de estoque e ingredientes',
                        'fidelizacao_clientes': '👥 Fidelização de clientes',
                        'controle_financeiro': '💰 Controle financeiro detalhado',
                        'automatizacao': '🤖 Automatização de processos'
                    };
                    mensagem += `${index + 1}. ${nomePrioridade[prioridade] || prioridade}\n`;
                });
                mensagem += `\n`;
            }
            
            // Observação das Prioridades
            if (dados.observacao_prioridades) {
                mensagem += `💡 *OBSERVAÇÃO - PRIORIDADES:*\n`;
                mensagem += `${dados.observacao_prioridades}\n\n`;
            }

            // Observações
            if (dados.observacoes && dados.observacoes.length > 0) {
                mensagem += `💡 *OBSERVAÇÕES GERAIS:*\n`;
                dados.observacoes.forEach(observacao => {
                    mensagem += `• ${observacao}\n`;
                });
                mensagem += `\n`;
            }

            // Rodapé
            mensagem += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            mensagem += `🫐 *PRÓXIMOS PASSOS:*\n`;
            mensagem += `• Análise completa das necessidades ✅\n`;
            mensagem += `• Proposta de sistema sob medida\n`;
            mensagem += `• Solução que vai transformar a operação da Lume Açaí!\n\n`;
            mensagem += `*Vamos conversar sobre como posso ajudar você a revolucionar sua loja?* 🚀`;

            return mensagem;
        }

        function showToast(message) {
            console.log('showToast chamada:', message);
            
            // Criar elemento de toast
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                z-index: 1000;
                font-weight: 500;
                animation: slideInRight 0.3s ease;
            `;
            toast.textContent = message;
            
            // Adicionar animação CSS
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(toast);
            console.log('Toast criado e exibido');
            
            // Remover após 3 segundos
            setTimeout(() => {
                toast.remove();
                console.log('Toast removido');
            }, 3000);
        }

        // Função para enviar dados para servidor (implementar conforme necessário)
        function enviarDadosParaServidor(dados) {
            console.log('enviarDadosParaServidor chamada com dados:', dados);
            
            // Exemplo de como você pode enviar os dados
            /*
            fetch('/api/diagnostico', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Dados enviados com sucesso:', data);
            })
            .catch((error) => {
                console.error('Erro ao enviar dados:', error);
            });
            */
        }

        // Teclas de atalho
        document.addEventListener('keydown', function(e) {
            console.log('Tecla pressionada:', e.key);
            
            if (e.key === 'ArrowLeft' && currentStep > 1) {
                console.log('Tecla esquerda - voltando etapa');
                previousStep();
            } else if (e.key === 'ArrowRight' && currentStep < totalSteps) {
                console.log('Tecla direita - próxima etapa');
                nextStep();
            } else if (e.key === 'Enter' && currentStep === totalSteps) {
                console.log('Tecla Enter - enviando formulário');
                submitForm();
            }
        });