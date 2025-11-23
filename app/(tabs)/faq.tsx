import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useProtectedScreen } from '../../src/hooks/useProtectedScreen';
import { useThemeColor } from '../../hooks/useThemeColor';

interface FAQItem {
  pergunta: string;
  resposta: string;
}

const faqs: FAQItem[] = [
  {
    pergunta: 'O que é o TrilhaJusta?',
    resposta: 'TrilhaJusta é uma plataforma de requalificação profissional e recrutamento inclusivo que conecta trabalhadores em transição de carreira com trilhas de capacitação, vagas de emprego e recomendações personalizadas por IA.',
  },
  {
    pergunta: 'Como criar uma conta?',
    resposta: 'Na tela de login, clique em "Cadastre-se". Preencha seu nome, e-mail, senha, cidade e UF. Após o cadastro, você será automaticamente conectado ao app.',
  },
  {
    pergunta: 'O que são trilhas de requalificação?',
    resposta: 'Trilhas são conjuntos estruturados de cursos que ajudam você a desenvolver competências específicas para uma nova área profissional. Cada trilha contém cursos com carga horária e provedores definidos.',
  },
  {
    pergunta: 'Como me candidatar a uma vaga?',
    resposta: 'Acesse a aba "Vagas", navegue pelas oportunidades disponíveis e clique em "Candidatar-se" na vaga de interesse. Você pode acompanhar suas candidaturas na tela "Minhas Candidaturas".',
  },
  {
    pergunta: 'Posso filtrar vagas por competências?',
    resposta: 'Sim! Na tela de Vagas, use os filtros no topo para selecionar suas competências e cidade. Isso mostrará vagas mais alinhadas ao seu perfil.',
  },
  {
    pergunta: 'Como adicionar competências ao meu perfil?',
    resposta: 'Vá na aba "Perfil", role até a seção "Minhas competências" e clique nos chips para adicionar ou remover competências do seu perfil.',
  },
  {
    pergunta: 'Posso editar meu perfil?',
    resposta: 'Sim! Na aba "Perfil", clique em "Editar perfil" no topo. Você pode alterar seu nome, cidade e UF. Clique em "Salvar" para confirmar as mudanças.',
  },
  {
    pergunta: 'O que são as Recomendações por IA?',
    resposta: 'É um recurso que usa inteligência artificial para sugerir trilhas personalizadas com base nos seus objetivos profissionais e experiência. Acesse pelo card no Dashboard.',
  },
  {
    pergunta: 'Como acompanhar o status das minhas candidaturas?',
    resposta: 'Clique em "Minhas candidaturas" no Dashboard. Você verá a lista de todas as vagas que se candidatou, com o status atual (Pendente, Em análise, Aprovada, Rejeitada).',
  },
  {
    pergunta: 'Posso cancelar uma candidatura?',
    resposta: 'Sim. Na tela "Minhas Candidaturas", clique no botão "Cancelar" vermelho na candidatura que deseja remover.',
  },
  {
    pergunta: 'O app funciona offline?',
    resposta: 'Não. O TrilhaJusta precisa de conexão com a internet para acessar as trilhas, vagas e candidaturas do servidor.',
  },
  {
    pergunta: 'Onde encontro informações sobre o app?',
    resposta: 'Acesse a aba "Sobre" no menu inferior. Lá você encontra informações sobre a stack tecnológica, funcionalidades e versão do app.',
  },
  {
    pergunta: 'Como faço logout?',
    resposta: 'Vá na aba "Perfil" e clique no botão "Sair" no canto superior direito.',
  },
  {
    pergunta: 'O app está apresentando erros. O que fazer?',
    resposta: 'Verifique sua conexão com a internet e se o backend está rodando. Se o problema persistir, tente fazer logout e login novamente.',
  },
];

export default function FAQScreen() {
  useProtectedScreen();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const accent = useThemeColor({}, 'accent');
  const background = useThemeColor({}, 'background');

  function toggleExpand(index: number) {
    setExpandedIndex(expandedIndex === index ? null : index);
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: background }]}>
      <Text style={styles.title}>Perguntas Frequentes</Text>
      <Text style={styles.subtitle}>
        Encontre respostas rápidas sobre o TrilhaJusta e como usar o app.
      </Text>

      {faqs.map((faq, index) => (
        <TouchableOpacity
          key={index}
          style={styles.faqCard}
          onPress={() => toggleExpand(index)}
          activeOpacity={0.7}
        >
          <View style={styles.faqHeader}>
            <Text style={styles.faqPergunta}>{faq.pergunta}</Text>
            <Text style={[styles.faqIcon, { color: accent }]}>
              {expandedIndex === index ? '−' : '+'}
            </Text>
          </View>
          {expandedIndex === index && (
            <Text style={styles.faqResposta}>{faq.resposta}</Text>
          )}
        </TouchableOpacity>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Ainda com dúvidas?</Text>
        <Text style={styles.footerText}>
          Entre em contato com o suporte ou consulte a documentação completa do projeto.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 20,
  },
  faqCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  faqPergunta: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#f9fafb',
    marginRight: 8,
  },
  faqIcon: {
    fontSize: 24,
    fontWeight: '700',
  },
  faqResposta: {
    marginTop: 12,
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  footer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#0f172a',
    borderRadius: 12,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f9fafb',
    marginBottom: 6,
  },
  footerText: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 18,
  },
});