import { createMachine, assign, actions } from 'xstate';
import { useMachine } from '@xstate/react';

const { assign: sharedAssign } = actions;

type TEstado = 'zerado' | 'rodando' | 'pausado';

type TContexto = {
    estado: TEstado;
    segundos: number;
    loop: NodeJS.Timer | null;
};

const incrementoSegundos = 1 / 64;

const cronometroMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QGMBOB7AdugtmALhgHQBeYqAhhOgMQCSAcnQMJ0CCASgNoAMAuolAAHdLACW+MVkEgAHogAsAJgCcRAKwBmAIxL1AGhABPRNoDsADiJn1AX1uG0WXAWIYIFTNRoAFTp14BJBARcUlpYPkEBU0ANiJNJQtdA2NFWLN7RwxsPEJ0IndPbwAtAFEOAP4ZUIkpTBkomLMNWL1DEwRkjSyQJ1zXAqEKAFdYKlpmAHkGABVGAFUqoOFROojQKO1YqxsOxESlIgsbXv6XfKJhsYmacsruauDa8IbI0x3rVM6Toh4LTSAoHAzQKewOEDYCBwGTnPIYGprV6NRAAWli+wQ6LOOQuxDIlGoiLC9RRCB0LS0KUx2m0PCIKnUAJBwLBELhg0K6A8XnQxPWb02iHUIuOKh4bW+iCUPBaKlO7Nx8KGo3GROeSNJ72iShpSm0xxZLLZ9iAA */
    id: 'cronometro',
    initial: 'zerado',
    context: {
        estado: 'zerado',
        segundos: 0,
        loop: null
    } as TContexto,
    states: {
        zerado: {
            on: {
                INICIAR: {
                    target: 'rodando',
                    actions: 'rodar'
                }
            }
        },
        rodando: {
            invoke: {
            src: (context) => (cb) => {
              const interval = setInterval(() => {
                cb('TICK');
              }, incrementoSegundos);
    
              return () => {
                clearInterval(interval);
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
                CONTINUAR: {
                    target: 'rodando',
                    actions: 'continuar'
                },
                ZERAR: {
                    target: 'zerado',
                    actions: 'parar'
                }
            }
        },
    }
},{
    actions: {
        rodar: sharedAssign({
            estado: _ => 'rodando' as TEstado,
            loop: context => {
                const incrementoSegundos = 1 / 64;
                return setTimeout(() => {
                    //send('TICK');
                  }, 1000 * incrementoSegundos)
            }
          }),
        continuar: sharedAssign({
            estado: _ => 'rodando' as TEstado,
            loop: context => {
                return setInterval(() => {
                    //send('TICK');
                  }, 1000 * incrementoSegundos)
            }
          }),
        parar: sharedAssign({
            estado: _ => 'pausado' as TEstado,
            loop: context => {
                context.loop && clearInterval(context.loop);
                return null;
            }
          }),
        zerar: sharedAssign({
            estado: _ => 'zerado' as TEstado,
            loop: context => {
                context.loop && clearInterval(context.loop);
                //setSegundos(0);
                return null;
            },
            segundos: _ => 0
          }),
        tick: sharedAssign({
            segundos: context => {
                return context.segundos + incrementoSegundos
            }
          }),
    }
});

type TAcao = 'INICIAR' | 'PARAR' | 'ZERAR' | 'CONTINUAR';

type TUseCronometroMachine = [
    TContexto, 
    (acao: TAcao) => void
];

const useCronometroMachine = () => {
    const [current, send] = useMachine(cronometroMachine);

    return [current.context, send] as TUseCronometroMachine;
};

export default useCronometroMachine;
