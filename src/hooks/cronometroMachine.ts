import { createMachine, actions } from 'xstate';
import { useMachine } from '@xstate/react';

const { assign: sharedAssign } = actions;

type TEstado = 'zerado' | 'rodando' | 'pausado';

type TContexto = {
    estado: TEstado;
    segundos: number;
};

const incrementoSegundos = 1 / 32;

const cronometroMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QGMBOB7AdugtmALhgHQBeYqAhhOgMQCSAcnQMJ0CCASgNoAMAuolAAHdLACW+MVkEgAHogAsAJgCcRAKwBmAIxL1AGhABPRNoDsADiJn1AX1uG0WXAWIYIFTNRoAFTp14BJBARcUlpYPkEBU0ANiJNJQtdA2NFWLN7RwxsPEJ0IndPbwAtAFEOAP4ZUIkpTBkomLMNWL1DEwRkjSyQJ1zXAqEKAFdYKlpmAHkGABVGAFUqoOFROojQKO1YqxsOxESlIgsbXv6XfKJhsYmacsruauDa8IbI0x3rVM6Toh4LTSAoHAzQKewOEDYCBwGTnPIYGprV6NRAAWli+wQ6LOOQuxDIlGoiLC9RRCB0LS0KUx2m0PCIKnUAJBwLBELhg0K6A8XnQxPWb02iHUIuOKh4bW+iCUPBaKlO7Nx8KGo3GROeSNJ72iShpSm0xxZLLZ9iAA */
    id: 'cronometro',
    predictableActionArguments: true,
    initial: 'zerado',
    context: {
        estado: 'zerado',
        segundos: 0,
    } as TContexto,
    states: {
        zerado: {
            on: {
                RODAR: {
                    target: 'rodando',
                    actions: 'rodar'
                }
            }
        },
        rodando: {
            invoke: {
            src: _ => (cb) => {
                let start = Date.now();
                let handle = requestAnimationFrame(check);

                function check(){
                    if(start + (1000*incrementoSegundos) >= Date.now()){
                    } else {
                        cb('TICK');
                        start = Date.now();
                    }
                    handle = requestAnimationFrame(check);
                }

              return () => {
                cancelAnimationFrame(handle);
              };
            }
          },
            on: {
                PARAR: {
                    target: 'pausado',
                    actions: 'parar'
                },
                ZERAR: {
                    target: 'zerado',
                    actions: 'zerar'
                },
                TICK: {
                    actions: 'tick'
                }
            }
        },
        pausado: {
            on: {
                RODAR: {
                    target: 'rodando',
                    actions: 'rodar'
                },
                ZERAR: {
                    target: 'zerado',
                    actions: 'zerar'
                }
            }
        },
    }
},{
    actions: {
        rodar: sharedAssign({
            estado: _ => 'rodando' as TEstado,
          }),
        parar: sharedAssign({
            estado: _ => 'pausado' as TEstado,
          }),
        zerar: sharedAssign({
            estado: _ => 'zerado' as TEstado,
            segundos: _ => 0
          }),
        tick: sharedAssign({
            segundos: (context) => {
                return context.segundos + incrementoSegundos
            }
          }),
    }
});

function useCronometroMachine(){
    let [current, enviar] = useMachine(cronometroMachine);

  const contexto: TContexto = current.context;

  type TEnviar = (acao: 'RODAR' | 'PARAR' | 'ZERAR') => void;
  return [contexto, enviar] as [TContexto, TEnviar];
}

export default useCronometroMachine;
