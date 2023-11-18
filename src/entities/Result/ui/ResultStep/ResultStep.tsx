import React, { ChangeEvent, FC, ReactNode, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import cls from './ResultStep.module.scss';
import { classNames } from '~/shared/lib/classNames';
import { Dropdown } from '~/shared/ui/Dropdown';
import { StepResult } from '../../model/types';
import { Navlink } from '~/shared/ui/Navlink';
import { Text } from '~/shared/ui/Text';
import { Product } from '~/entities/Product';
import { Checkbox } from '~/shared/ui/Checkbox';
import { Line } from '~/shared/ui/Line';
import { IComponent } from '~/entities/Step';
import {
	getComponentsByStep,
	getComponentsOfCurrentStep,
	ResultSliceActions
} from '~/entities/Result';
import { useAppDispatch } from '~/shared/lib/useAppDispatch';

interface ResultStepProps {
	className?: string;
	resultStep?: StepResult;
}

export const ResultStep = (props: ResultStepProps) => {
	const { className = '', resultStep } = props;
	const dispatch = useAppDispatch();

	const ifComponentChecked = useCallback(
		(componentId: number): boolean => {
			return resultStep?.values.some((i) => i.id === componentId);
		},
		[resultStep?.values]
	);

	const generateProductOnChangeHandler = useCallback(
		(c: IComponent) => {
			return (event: ChangeEvent<HTMLInputElement>) => {
				if (event.target.checked) {
					dispatch(
						ResultSliceActions.addComponentToStep({
							order: resultStep.order,
							component: c
						})
					);
				} else {
					dispatch(
						ResultSliceActions.removeComponentFromStep({
							order: resultStep.order,
							componentId: c.id
						})
					);
				}
			};
		},
		[dispatch, resultStep.order]
	);

	const trigger = useMemo(() => {
		return (
			<div className={cls.trigger}>
				<div className={cls.trigger_div}>
					<Navlink
						title={resultStep.order}
						clickable={false}
					/>
					<Text title={resultStep.title} />
				</div>
			</div>
		);
	}, [resultStep.order, resultStep.title]);

	const content = useMemo(() => {
		if (resultStep.isMultiple) {
			return resultStep.values.map((i) => {
				return (
					<>
						<Line />
						<div className='flex my-4 justify-between items-baseline'>
							<Checkbox
								onChange={generateProductOnChangeHandler(i)}
								text={i.title}
								checked={ifComponentChecked(i.id)}
								textClasses='w-max'
							/>
							<Line
								className='mx-3'
								type='dashed'
							/>
							<span>{i.price}</span>
						</div>
					</>
				);
			});
		}

		return resultStep.values.map((i) => {
			return (
				<>
					<Line />
					<div className='flex my-4 justify-between items-baseline'>
						<span className='w-max'>{i.title}</span>
						<Line
							className='mx-3'
							type='dashed'
						/>
						<span className='w-max'>{i.price}</span>
					</div>
				</>
			);
		});
	}, [resultStep.isMultiple, resultStep.values]);

	return (
		<Dropdown
			trigger={trigger}
			className={classNames(cls.ResultStep, {}, [className])}
		>
			<div className={classNames(cls.content)}>{content}</div>
		</Dropdown>
	);
};