import { ComponentFixture } from '@angular/core/testing';

export const deepCopy = (obj: any): any => JSON.parse(JSON.stringify(obj));

export const click = <T>(fixture: ComponentFixture<T>, button: HTMLElement) => {
  const event = new Event('click');
  button.dispatchEvent(event);
  fixture.detectChanges();
};

export const setInputValue = <T>(fixture: ComponentFixture<T>, input: HTMLIonInputElement, value: string) => {
  const event = new InputEvent('ionInput');
  input.value = value;
  input.dispatchEvent(event);
  fixture.detectChanges();
};
