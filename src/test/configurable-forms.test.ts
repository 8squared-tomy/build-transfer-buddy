import { describe,it,expect } from 'vitest';
import { validateAnswers,validateFields,type FormFieldDef } from '@/lib/forms';
import { allowedEditor } from '@/lib/club-ui';
describe('Configurable form requirements',()=>{
 const f:FormFieldDef={id:'name',type:'text',label:'Name',required:true};
 it('requires fields marked required',()=>expect(validateAnswers([f],{name:''}).name).toBe('required'));
 it('allows fields marked optional to be empty',()=>expect(validateAnswers([{...f,required:false}],{})).toEqual({}));
 it('allows admin-created headings without visitor answers',()=>expect(validateAnswers([{...f,type:'heading'}],{})).toEqual({}));
 it('rejects invalid radio choices',()=>expect(validateAnswers([{...f,type:'radio',options:['Yes','No']}],{name:'Maybe'}).name).toBe('invalid'));
 it('rejects duplicate field identifiers',()=>expect(validateFields([f,f])).toBe(false));
 it('requires residence, bac and phone only for accommodation',()=>{const a:FormFieldDef={id:'stay',type:'accommodation',label:'Stay',required:false};expect(validateAnswers([a],{stay:{needed:false,residence:'',bac:'',phone:''}})).toEqual({});expect(validateAnswers([a],{stay:{needed:true,residence:'',bac:'',phone:''}}).stay).toBe('invalid');expect(validateAnswers([a],{stay:{needed:true,residence:'Residence A',bac:'00123',phone:'0555123456'}})).toEqual({});});
});
describe('Fixed editor eligibility',()=>{
 it('allows ivan07.hcj@gmail.com',()=>expect(allowedEditor('ivan07.hcj@gmail.com')).toBe(true));
 it('allows mohammed.yahiaoui@nhsm.edu.dz',()=>expect(allowedEditor('mohammed.yahiaoui@nhsm.edu.dz')).toBe(true));
 it('rejects other emails',()=>expect(allowedEditor('other@example.com')).toBe(false));
});
