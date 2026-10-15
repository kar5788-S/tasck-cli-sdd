import { describe, expect, it } from 'vitest';
import { esTransicionValida, normalizarEstado, normalizarPrioridad, validarTitulo } from '../src/utils/tasks.js';

describe('validarTitulo', () => {
  it('rechaza título vacío', () => {
    expect(() => validarTitulo('')).toThrow();
    expect(() => validarTitulo('   ')).toThrow();
  });

  it('recorta espacios', () => {
    expect(validarTitulo('  Comprar leche  ')).toBe('Comprar leche');
  });
});

describe('normalizarPrioridad', () => {
  it('acepta valores válidos', () => {
    expect(normalizarPrioridad('high')).toBe('high');
    expect(normalizarPrioridad('MEDIUM')).toBe('medium');
    expect(normalizarPrioridad('low')).toBe('low');
  });

  it('rechaza inválidos', () => {
    expect(() => normalizarPrioridad('urgente')).toThrow();
  });
});

describe('normalizarEstado', () => {
  it('acepta valores válidos', () => {
    expect(normalizarEstado('todo')).toBe('todo');
    expect(normalizarEstado('in-progress')).toBe('in-progress');
    expect(normalizarEstado('DONE')).toBe('done');
  });

  it('rechaza inválidos', () => {
    expect(() => normalizarEstado('archived')).toThrow();
  });
});

describe('esTransicionValida', () => {
  it('permite todo → in-progress', () => {
    expect(esTransicionValida('todo', 'in-progress')).toBe(true);
  });

  it('permite in-progress → done', () => {
    expect(esTransicionValida('in-progress', 'done')).toBe(true);
  });

  it('permite in-progress → todo', () => {
    expect(esTransicionValida('in-progress', 'todo')).toBe(true);
  });

  it('permite done → todo', () => {
    expect(esTransicionValida('done', 'todo')).toBe(true);
  });

  it('rechaza todo → done', () => {
    expect(esTransicionValida('todo', 'done')).toBe(false);
  });

  it('rechaza done → in-progress', () => {
    expect(esTransicionValida('done', 'in-progress')).toBe(false);
  });

  it('rechaza todo → todo', () => {
    expect(esTransicionValida('todo', 'todo')).toBe(false);
  });
});
